var config = {
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
