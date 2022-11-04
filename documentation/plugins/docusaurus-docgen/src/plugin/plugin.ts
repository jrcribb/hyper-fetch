/* eslint-disable global-require */
import pluginBase, { LoadedContent } from "@docusaurus/plugin-content-docs";
import { Plugin, LoadContext } from "@docusaurus/types";
import * as path from "path";
import mermaid from "mdx-mermaid";
import admonitions from "remark-admonitions";

import { copyLibFiles, prepareApiDirectory } from "../docs/generator/utils/file.utils";
import { PluginOptions } from "../types/package.types";
import { trace, info, warning } from "../utils/log.utils";
import { libraryDir } from "../constants/paths.constants";
import { buildDocs } from "../docs/docs";
import { name } from "../constants/name.constants";

let generated = false;
let generating = false;

export async function plugin(
  context: LoadContext,
  options: PluginOptions,
): Promise<Plugin<LoadedContent>> {
  const { generatedFilesDir } = context;

  const docsGenerationDir = path.join(
    generatedFilesDir,
    "..",
    libraryDir,
    options.contentDocsOptions.routeBasePath,
  );

  // Prepare dependencies
  copyLibFiles();
  // eslint-disable-next-line @typescript-eslint/no-var-requires, import/extensions, import/no-dynamic-require
  const { DEFAULT_OPTIONS } = require(`.bin/${name}/options`);

  // Prepare api directory to exist
  if (!generated) prepareApiDirectory(docsGenerationDir);

  trace("Initializing plugin...");
  const instance = (await pluginBase(context as any, {
    ...DEFAULT_OPTIONS,
    ...options.contentDocsOptions,
    path: path.join(libraryDir, options.contentDocsOptions.routeBasePath),
    id: options.id,
    remarkPlugins: [...(options?.contentDocsOptions?.remarkPlugins || []), mermaid, admonitions],
  })) as any;
  info("Successfully initialized plugin.");

  return {
    ...instance,
    loadContent: async function loadContent() {
      if (!generating) {
        generating = true;
        await buildDocs(docsGenerationDir, generatedFilesDir, options);
        trace("Loading generated docs.");
        generating = false;
        generated = true;
      } else {
        warning("Docs generation already triggered. Try again when process finishes.");
      }

      // eslint-disable-next-line no-console
      console.log("\n");
      return instance.loadContent?.();
    } as any,
  };
}