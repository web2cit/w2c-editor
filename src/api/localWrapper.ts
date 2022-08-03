// implements abstract wrapper with web2cit library

import { Wrapper } from "./wrapper";
import { Domain } from "web2cit";
import { TargetOutput, TargetResult, TargetFieldOutput, FieldOutputValue, TemplateFieldOutput, Target } from "../types";
import { stringify } from "querystring";

export class LocalWrapper extends Wrapper {
  domain: Domain | undefined;

  setDomain(name: string): string {
    this.domain = new Domain(name);
    return this.domain.domain;
  }

  getTargets(): Target[] {
    if (this.domain === undefined) {
      throw new Error();
    }
    const paths = this.domain.getPaths();
    const templates = this.domain.templates.paths;

    // fixme: sortPaths returns catch-all pattern actual glob (i.e., not
    // undefined or null)
    const pathsByPattern = this.domain.patterns.sortPaths(paths);

    const templatePathsByPattern = this.domain.patterns.sortPaths(templates);

    const patternsByPath: Map<string, string | null> = new Map();
    // todo: read https://mariusschulz.com/blog/downlevel-iteration-for-es3-es5-in-typescript
    Array.from(pathsByPattern.entries()).forEach(([pattern, paths]) => {
      paths.forEach((path) => {
        patternsByPath.set(path, pattern);
      });
    });
    const targets: Target[] = paths.map((path) => {
      const pattern = patternsByPath.get(path)!;
      // todo: have w2c-core return templates for a given pattern or path
      const templates = templatePathsByPattern.get(pattern)!;
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
    const outputs = await this.domain.translate(
      path,
      {
        forceTemplatePaths: templates,
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

      output.template.fields.forEach((field) => {
        const name = field.name;
        let fieldOutput = targetOutput.fields.find(
          (field) => field.name === name
        );
        if (fieldOutput === undefined) {
          fieldOutput = { name };
          targetOutput.fields.push(fieldOutput);
        }
        fieldOutput.template = {
          name: name,
          values: field.output.map((value) => ({
            value,
            // todo: make w2c-core return validity for individual field
            // output values
            valid: true
          })),
          applicable: field.applicable,
          procedures: field.procedures.map((procedure) => ({
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
        )};
      });

      let scoreCount = 0;
      let scoreSum = 0;      
      output.scores.fields.forEach((field) => {
        const name = field.fieldname;
        let fieldOutput = targetOutput.fields.find(
          (field) => field.name === name
        );
        if (fieldOutput === undefined) {
          fieldOutput = { name };
          targetOutput.fields.push(fieldOutput);
        };
        fieldOutput.test = {
          name,
          score: field.score
        }
        scoreCount += 1;
        scoreSum += field.score;
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