// an abstract class defining what wrappers should look like

import { Target, TargetResult, TemplateConfig, TestConfig } from "../types"
import { PatternConfig, ConfigRevision } from "../types"

// We may have different wrappers depending on how we generate the
// data model
// * using the web2cit library
// * fetching data from the translation server (read only)
// * fething and sending data to the translation server

export abstract class Wrapper {
  
  abstract setDomain(name: string): string;

  abstract fetchConfigRevisions(config: "patterns" | "templates" | "tests"): Promise<ConfigRevision[]>;

  abstract loadPatternsRevision(revid: number): Promise<PatternConfig[]>;
  abstract loadTemplatesRevision(revid: number): Promise<TemplateConfig[]>;
  abstract loadTestsRevision(revid: number): Promise<TestConfig[]>;

  // todo: consider having some general add/remove/move/update value functions
  // and pass the config type as parameter
  // note that the return type may be undeterminate (unless we do overloads?)
  abstract addPattern(value: PatternConfig): void;
  abstract removePattern(id: string): void;
  abstract movePattern(id: string, index: number): void;
  abstract updatePattern(id: string, value: PatternConfig): void;

  // abstract addConfig(type: 'patterns', value: PatternConfig): void;
  // abstract addConfig(type: 'templates', value: TemplateConfig): void;
  // abstract addConfig(type: 'tests', value: TestConfig): void;
  // abstract addConfig(type, value): void;
  
  abstract addTemplate(value: TemplateConfig): void;
  abstract removeTemplate(id: string): void;
  abstract moveTemplate(id: string, index: number): void;
  abstract updateTemplate(id: string, value: TemplateConfig): void;

  // same with tests

  // consider accepting a pattern argument that forces pattern grouping so that
  // it does not have to be calculated again
  // or a list of template paths
  abstract translate(path: string, templates?: string[]): Promise<TargetResult[]>;

  // abstract sort(paths: string[]): sortmap;
  abstract getTargets(): Target[];
}