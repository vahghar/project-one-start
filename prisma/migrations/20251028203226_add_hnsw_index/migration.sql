CREATE INDEX ON "sourceCodeEmbedding"
USING HNSW ("summaryEmbedding" vector_cosine_ops);