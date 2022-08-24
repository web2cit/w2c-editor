// implements abstract wrapper with web2cit library

import { Wrapper } from "./wrapper";
import { Domain } from "web2cit";
import {
  TargetOutput,
  TargetResult,
  Target,
  PatternConfig,
  TestConfig,
  TemplateConfig,
  FallbackTemplateConfig,
  TargetFieldOutput
} from "../types";
import { FieldName } from "web2cit/dist/translationField";
import { FallbackTemplateDefinition, TemplateDefinition, TestDefinition } from "web2cit/dist/types";

export class LocalWrapper extends Wrapper {
  domain: Domain | undefined;

  setDomain(name: string): string {
    // todo: we should add w2c-editor to user agent header
    // fixme: how come the browser is not overriding our user agent?
    // https://meta.wikimedia.org/wiki/User-Agent_policy/es
    this.domain = new Domain(name);
    return this.domain.domain;
  }

  getCatchAllPattern(): PatternConfig | undefined {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    const pattern = this.domain.patterns.catchall?.toJSON() ?? undefined;
    return pattern;
  }

  getFallbackTemplate(): FallbackTemplateConfig | undefined {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    const template = this.domain.templates.fallback;
    const editorTemplate = template && coreTemplateToEditor(template);
    return editorTemplate;
  }

  // todo: consider supporting a fetchLatestRevision

  // todo: consider changing name to something that distinguishes between
  // fetching revision metadata and revision data
  async fetchConfigRevisions(config: 'patterns' | 'templates' | 'tests') {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    const configObj = this.domain[config];
    const revisions = await configObj.getRevisionIds();
    return revisions.map((revision) => ({
      id: revision.revid,
      timestamp: revision.timestamp
    }));
  }

  // async loadConfigRevision<ConfigType extends PatternConfig | TemplateConfig | TestConfig>(
  //   config: (
  //     ConfigType extends PatternConfig ?
  //     'patterns' :
  //     ConfigType extends TemplateConfig ?
  //     'templates' :
  //     ConfigType extends TestConfig ?
  //     'tests' : never
  //   ),
  //   revid: number
  // ): Promise<ConfigType[]> {
  //   if (this.domain === undefined) {
  //     throw new InitializationError();
  //   };
  //   const configObj = this.domain[config];
  //   const revision = await configObj.getRevision(revid);
  //   if (revision === undefined) {
  //     throw new UnknownRevidError(config, revid);
  //   }
  //   configObj.loadRevision(revision);
  //   const values = configObj.get();
  //   return values;
  // }

  async loadPatternsRevision(revid: number): Promise<PatternConfig[]> {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    const revision = await this.domain.patterns.getRevision(revid);
    if (revision === undefined) {
      throw new UnknownRevidError("patterns", revid);
    }
    this.domain.patterns.loadRevision(revision);
    const patterns = this.domain.patterns.toJSON();
    return patterns;
  }

  async loadTemplatesRevision(revid: number): Promise<TemplateConfig[]> {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    const revision = await this.domain.templates.getRevision(revid);
    if (revision === undefined) {
      throw new UnknownRevidError("templates", revid);
    }
    this.domain.templates.loadRevision(revision);
    const templates = this.domain.templates.toJSON();
    // core's TemplateDefinition differs from editor's TemplateConfig
    return templates.map((template) => coreTemplateToEditor(template));
  }

  async loadTestsRevision(revid: number): Promise<TestConfig[]> {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    const revision = await this.domain.tests.getRevision(revid);
    if (revision === undefined) {
      throw new UnknownRevidError("tests", revid);
    };
    this.domain.tests.loadRevision(revision);
    // todo: could something happen above such that nothing is loaded and
    // we return the old config below?
    const tests = this.domain.tests.toJSON();
    return tests.map(coreTestToEditor);
  }

  addPattern(value: PatternConfig, index?: number) {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    const { pattern, label } = value;
    // todo: we shouldn't check if pattern expression is undefined/null
    // if we create specific types for catch-all patterns/fallback templates
    if (pattern === null) {
      throw new TypeError(
        "Invalid pattern expression"
      );
    }
    try {
      // note that these w2c-core's domain configuration objects already set
      // their currentRevid to undefined following one of these add/remove/move
      // operations
      // we are not reading this currentRevid. Hopefully, this won't mean they
      // end up diverging
      this.domain.patterns.add({
        pattern,
        label
      }, index);
    } catch (e) {
      throw e;
    }
  }

  removePattern(id: string) {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    // domain.patterns silently proceeds if no matching pattern found;
    // we should do the same
    this.domain.patterns.remove(id);
  }

  movePattern(id: string, index: number) {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    this.domain.patterns.move(id, index);
  }

  updatePattern(id: string, value: PatternConfig) {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    // updating config values is not natively supported in w2c-core's domain
    // configuration objects
    // todo: consider having w2c-core natively support updating config values
    const index = this.domain.patterns.get().findIndex(
      (pattern) => pattern.pattern === id
    );
    if (index > -1) {
      this.domain.patterns.remove(id);
      this.addPattern(value, index);
    }
    // what about returning a change object here?
  }

  addTemplate(value: TemplateConfig, index?: number): void {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    const template = editorTemplateToCore(value);
    this.domain.templates.add(template, index); 
  };

  removeTemplate(id: string): void {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    this.domain.templates.remove(id);
  };

  moveTemplate(id: string, index: number): void {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    this.domain.templates.move(id, index);
  };

  updateTemplate(id: string, value: TemplateConfig): void {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    // todo: have w2c-core natively support updating config values
    const index = this.domain.templates.get().findIndex(
      (template) => template.path === id
    );
    if (index > -1) {
      this.domain.templates.remove(id);
      this.addTemplate(value, index);
    }
    // what about returning a change object here?
  };

  addTest(value: TestConfig, index?: number): void {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    const test = editorTestToCore(value);
    this.domain.tests.add(test, index);
  };

  removeTest(id: string): void {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    this.domain.tests.remove(id);
  };

  updateTest(id: string, value: TestConfig): void {
    if (this.domain === undefined) {
      throw new InitializationError();
    };
    // todo: have w2c-core natively support updating config values
    const index = this.domain.tests.get().findIndex(
      (test) => test.path === id
    );
    if (index > -1) {
      this.domain.tests.remove(id);
      this.addTest(value, index);
    }
    // what about returning a change object here?
  };

  getTargets(): Target[] {
    if (this.domain === undefined) {
      throw new Error();
    }
    // fixme: race condition?
    const paths = this.domain.getPaths();
    const templates = this.domain.templates.paths;
    
    const pathsByPattern: Map<string|null, string[]> = this.domain.patterns.sortPaths(paths);
    // const templatePathsByPattern: Map<string|null, string[]> = this.domain.patterns.sortPaths(templates);

    // fixme: sortPaths returns catch-all pattern actual glob (i.e., not
    // undefined or null)
    const catchall = this.domain.patterns.catchall?.pattern;
    if (catchall !== undefined) {
      const catchallPatternPaths = pathsByPattern.get(catchall);
      if (catchallPatternPaths !== undefined) {
        pathsByPattern.set(null, catchallPatternPaths);
        pathsByPattern.delete(catchall);
      };
      // const catchallPatternTempates = templatePathsByPattern.get(catchall);
      // if (catchallPatternTempates !== undefined) {
      //   templatePathsByPattern.set(null, catchallPatternTempates);
      //   templatePathsByPattern.delete(catchall);
      // }
    };

    const templatePathsByPattern: Map<string|null, string[]> = new Map();
    const patternsByPath: Map<string, string | null> = new Map();
    // todo: read https://mariusschulz.com/blog/downlevel-iteration-for-es3-es5-in-typescript
    Array.from(pathsByPattern.entries()).forEach(([pattern, paths]) => {
      templatePathsByPattern.set(
        pattern,
        paths.filter((path) => templates.includes(path))
      );
      paths.forEach((path) => {
        patternsByPath.set(path, pattern);
      });
    });
    const targets: Target[] = paths.map((path) => {
      const pattern = patternsByPath.get(path);
      if (pattern === undefined) {
        throw new Error(`Unexpected undefined pattern for path ${path}`);
      }
      // todo: have w2c-core return templates for a given pattern or path
      const templates = templatePathsByPattern.get(pattern);
      if (templates === undefined) {
        throw new Error(`Unexpected undefined templates for pattern ${pattern}`);
      }

      // todo: add fallback template if applicable (from domain config)
      // todo: put same as path template first (also check domain config; preferSamePath)
      return {
        path: path,
        pattern: pattern,
        results: templates.map((template) => ({
          template,
          output: undefined
        })),
        preferredResult: undefined
      }
    });
    return targets;
  }

  async translate(
    path: string,
    templates?: Array<string|null>
  ): Promise<TargetResult[]> {
    if (this.domain === undefined) {
      throw new Error();
    };

    // todo: as far as I can recall, the domain's translate method is the first
    // (and only?) which requires fetching the html from the target web server.
    // doing so from a w2c iframe may be disallowed, depending on the target
    // server's CORS configuration.
    // On the other hand, having the app outside of an iframe may prevent
    // fetching resources from metawiki or citoid, if the target page uses CSP.
    // Consider using "frame-rpc". Have a fetch method on the target page. Have
    // the iframe use this fetch method to preload the needed webpages before
    // translation

    // const webpage = this.domain.webpages.getWebpage(path);
    // todo: implement setdata method
    // webpage.cache.http.setData();
    
    const outputs = await this.domain.translate(
      path,
      {
        // fixme: as string[]...
        forceTemplatePaths: templates as string[],
        onlyApplicable: false
      }
    );
    const output = outputs[0];
    if (output === undefined) {
      throw new Error();
    };

    const outputsByTemplate: Map<string | null, TargetOutput> = new Map();
    output.translation.outputs.forEach((output) => {
      const applicable = output.template.applicable;
      if (applicable === undefined) {
        // unexpected undefined applicability for tried template
        // todo: in w2c-core, revise when applicable may be undefined
        throw new Error();
      }
      // initialize target output
      const targetOutput: TargetOutput = {
        applicable,
        // todo: have w2c-core return target field score      
        score: null,
        fields: []
      };

      // todo: we are already almost the exact same thing in w2c-server's
      // makeTranslationResult
      // Update w2c-core so that it returns data in the most useful format
      // as per T302431

      const fieldnames = Array.from(new Set([
        ...output.template.fields.map((field) => field.name),
        ...output.scores.fields.map((field) => field.fieldname)
      ]));

      let scoreCount = 0;
      let scoreSum = 0;
      fieldnames.forEach((fieldname) => {
        const templateFieldOutput = output.template.fields.find(
          (field) => field.name === fieldname
        );
        // if (templateFieldOutput === undefined) {
        //   throw new Error(
        //     // w2c-core should always return a template field output, even if
        //     // template field config is unavailable (in cases where test field
        //     // output is available) 
        //     `Unexpected undefined template field output from w2c-core`
        //   )
        // };

        const testFieldOutput = output.scores.fields.find(
          (field) => field.fieldname === fieldname
        );
        if (testFieldOutput !== undefined) {
          scoreCount += 1;
          scoreSum += testFieldOutput.score;
        };

        const fieldOutput: TargetFieldOutput = {
          name: fieldname,
          template: templateFieldOutput ? {
            name: fieldname,
            values: templateFieldOutput.output.map((value) => ({
              value,
              // todo: make w2c-core return validity for individual field
              // output values
              valid: true
            })),
            applicable: templateFieldOutput.applicable,
            procedures: templateFieldOutput.procedures.map((procedure) => ({
              selections: procedure.selections.map(
                (selection) => ({
                  values: selection.output,
                  // todo: can w2c-core return output errors for individual
                  // selection steps?
                  error: undefined
                })
              ),
              transformations: procedure.transformations.map(
                (transformation) => ({
                  values: transformation.output,
                  // todo: can w2c-core return output errors for individual
                  // transformation steps?
                  error: undefined
                })
              )
            })
          )} : {
            name: fieldname,
            values: [],
            // w2c-core should return data in a more useful format
            // in the meantime, return applicable=true for undefined template
            // fields, as if they were required=false
            // note that w2c-core should fail if a mandatory template field
            // was missing
            // todo: make sure we mark the corresponding template field config
            // as required=false
            applicable: true,
            procedures: []
          },
          test: {
            name: fieldname,
            score: testFieldOutput ? testFieldOutput.score : null
          }
        };
        targetOutput.fields.push(fieldOutput);
      });

      targetOutput.score = scoreCount > 0 ? scoreSum/scoreCount : null;

      // fixme: if empty values are not valid in authorLast, how come an
      // authorLast array shorter than authorFirst is valid? What are we doing
      // in these cases?

      outputsByTemplate.set(
        // todo: in w2c-core, consider making fallback template's path null
        output.template.path ?? null,
        targetOutput
      );      
    });

    templates ??= Array.from(outputsByTemplate.keys());

    const results: TargetResult[] = templates.map((template) => {
      const output = outputsByTemplate.get(template);
      const result: TargetResult = {
        template,
        output: output ?? null
      };
      return result;
    });

    return results;
  }
}

/**
 * Converts a template definition from w2c-editor into w2c-core format.
 * @param template - The template definition in w2c-editor
 *  format.
 * @returns The template definition in w2c-core format.
 */
function editorTemplateToCore(template: TemplateConfig): TemplateDefinition {
  const { path, label, fields } = template;
  if (path === null) {
    throw new TypeError(
      "Invalid template path"
    );
  }
  const coreTemplate: TemplateDefinition = {
    path,
    label,
    fields: fields.map((field) => ({
      fieldname: field.name as FieldName,
      procedures: field.procedures.map((procedure) => ({
        selections: procedure.selections.map((selection) => ({
          type: selection.type,
          config: selection.args.map((arg) => arg.value).join(",")
        })),
        transformations: procedure.transformations.map((transformation) => ({
          type: transformation.type,
          itemwise: transformation.itemwise,
          config: transformation.args.map((arg) => arg.value).join(",")
        }))
      })),
      required: field.required        
    }))
  };
  return coreTemplate;
}

/**
 * Converts a template definition from w2c-core into w2c-editor format.
 * @param template - The template definition in w2c-core
 *  format.
 * @returns The template definition in w2c-editor format.
 */
function coreTemplateToEditor( template: TemplateDefinition ): TemplateConfig
function coreTemplateToEditor( template: FallbackTemplateDefinition ): FallbackTemplateConfig
function coreTemplateToEditor(
  template: TemplateDefinition | FallbackTemplateDefinition
): TemplateConfig | FallbackTemplateConfig {
  const editorTemplate: TemplateConfig | FallbackTemplateConfig = {
    path: 'path' in template ? template.path : null,
    label: template.label,
    fields: template.fields.map((field) => ({
      name: field.fieldname,
      required: field.required,
      procedures: field.procedures.map((procedure) => ({
        selections: procedure.selections.map((selection) => ({
          type: selection.type,
          args: selection.config.split(",").map((value) => ({
            value
          }))
        })),
        transformations: procedure.transformations.map((transformation) => ({
          type: transformation.type,
          itemwise: transformation.itemwise,
          args: transformation.config.split(",").map((value) => ({
            value
          }))
        }))
      }))
    }))
  }
  return editorTemplate;
}

/**
 * Converts a test definition from w2c-editor into w2c-core format.
 * @param test - The test definition in w2c-editor
 *  format.
 * @returns The test definition in w2c-core format.
 */
function editorTestToCore(test: TestConfig): TestDefinition {
  const fields = test.fields.reduce(
    (fields: TestDefinition["fields"], field) => {
      if(field.goal !== undefined) {
        // skip undefined-goal fields
        fields.push({
          fieldname: field.name as FieldName,
          // todo: do we need to skip invalid goal values?
          goal: field.goal.map((value) => value.value)
        });
      }
      return fields;
    }, [])
  const coreTest: TestDefinition = {
    path: test.path,
    fields 
  };
  return coreTest;
}

/**
 * Converts a test definition from w2c-core into w2c-editor format.
 * @param test - The test definition in w2c-core
 *  format.
 * @returns The test definition in w2c-editor format.
 */
 function coreTestToEditor(test: TestDefinition): TestConfig {
  const editorTest: TestConfig = {
    path: test.path,
    fields: test.fields.map((field) => ({
      name: field.fieldname,
      goal: field.goal.map((value) => ({
        value,
        // todo: does the core know about invalid test goals?
        // or do they not pass validation?
        valid: true
      }))
    }))
  };
  return editorTest;
}

class InitializationError extends Error {
  constructor() {
    super("Wrapper's Domain object has not been initialized yet");
    this.name = "InitializationError";
  }
}

class UnknownRevidError extends Error {
  constructor(
    config: 'patterns' | 'templates' | 'tests',
    revid: number
  ) {
    super(
      `Unknown ${config} revid: ${revid}`
    );
    this.name = "UnknownRevidError";
  }
}