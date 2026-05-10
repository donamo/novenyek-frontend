import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "external/schema.graphql",
  documents: ["src/graphql/**/*.ts"],
  generates: {
    "src/gql/": {
      preset: "client"
    }
  },
  ignoreNoDocuments: true
};

export default config;
