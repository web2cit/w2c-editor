// an abstract class defining what wrappers should look like

import { Target, TargetResult } from "../types"

// We may have different wrappers depending on how we generate the
// data model
// * using the web2cit library
// * fetching data from the translation server (read only)
// * fething and sending data to the translation server



export abstract class Wrapper {
  
  abstract setDomain(name: string): string;

  // abstract fetchConfigRevisions(): {}

  // abstract loadConfigRevId(config: string, revid: number): {}

  // abstract addPattern(pattern: string, label?: string): void;
  // abstract removePattern(pattern: string): void;
  // abstract movePattern(): void;
  // abstract updatePattern(): void;

  // abstract addTemplate
  // abstract removeTemplate
  // abstract moveTemplate
  // abstract updateTemplate

  // same with tests

  // consider accepting a pattern argument that forces pattern grouping so that
  // it does not have to be calculated again
  // or a list of template paths
  abstract translate(path: string, templates?: string[]): Promise<TargetResult[]>;

  // abstract sort(paths: string[]): sortmap;
  abstract getTargets(): Target[];
}