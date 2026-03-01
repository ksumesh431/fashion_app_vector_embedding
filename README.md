# AI Fashion App — Visually Similar Items

An AI-powered fashion app that recommends **visually similar products** using deep learning embeddings and vector similarity search. Built with Next.js, Supabase (pgvector), and OpenAI's CLIP model.

---

## Table of Contents

- [How It Works](#how-it-works)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [AI Model — CLIP](#ai-model--clip)
- [Vector Database — pgvector](#vector-database--pgvector)
- [Data Flow](#data-flow)
- [Project Structure](#project-structure)
- [Setup & Running](#setup--running)
- [Production Architecture](#production-architecture)

---

## How It Works

The app uses **computer vision AI** to find products that look visually similar — matching by color, texture, shape, design, and style — not by text metadata.

### Core Concept

```
Product Image (pixels)
        ↓
   CLIP AI Model
        ↓
[0.023, -0.187, 0.445, ... ]  ← 512-dimensional vector (embedding)
        ↓
   Stored in Supabase (pgvector)
        ↓
   Cosine similarity search finds nearest neighbors
        ↓
   Returns visually similar products
```

Two images that **look similar** produce vectors that are **mathematically close** in 512-dimensional space. The closer the vectors, the more visually similar the items.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    SEED TIME (One-time)              │
│                                                      │
│  Product Images ──→ CLIP Model ──→ 512-dim Vectors   │
│                                    ↓                 │
│                              Supabase DB             │
│                         (products table +            │
│                          pgvector extension)          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   QUERY TIME (Every request)         │
│                                                      │
│  User clicks Look ──→ Frontend sends productId       │
│                            ↓                         │
│                    /api/similar-products              │
│                            ↓                         │
│              Fetch product's stored embedding         │
│                            ↓                         │
│              match_products() RPC function            │
│              (cosine distance via pgvector)           │
│                            ↓                         │
│              Top N similar products returned          │
│                            ↓                         │
│              Rendered in grid on frontend             │
└─────────────────────────────────────────────────────┘
```

**Key design decision**: The AI model (CLIP) runs **only at seed time**, not on every user request. This makes queries fast (~400-500ms) since they only involve a database vector comparison, not neural network inference.

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Next.js 16, React, Tailwind CSS | UI, routing, server-side rendering |
| **Backend** | Next.js API Routes | REST API for similarity search |
| **Database** | Supabase (PostgreSQL) | Product storage |
| **Vector Search** | pgvector extension | Cosine similarity on embeddings |
| **AI Model** | CLIP (ViT-B/32) via `@xenova/transformers` | Image → embedding conversion |
| **Runtime** | Node.js | Seed scripts, dev server |

---

## AI Model — CLIP

### What is CLIP?

**CLIP** (Contrastive Language-Image Pre-training) is a neural network developed by **OpenAI** that understands both images and text. It was trained on 400 million image-text pairs from the internet.

### How we use it

We use the **vision encoder** portion of CLIP to convert product images into numerical vectors:

```
Input:  JPEG image (any resolution)
Model:  Xenova/clip-vit-base-patch32 (ViT-B/32 architecture)
Output: Float32Array[512] — a 512-dimensional embedding vector
```

### What does the embedding capture?

The 512 numbers encode:
- **Color** — dominant colors, color distribution
- **Shape** — silhouette, proportions
- **Texture** — fabric patterns, material appearance  
- **Style** — formal vs casual, sporty vs elegant
- **Category** — clothing type recognition
- **Composition** — how the item is photographed

### Why CLIP and not a custom model?

- **Zero-shot**: Works on any clothing item without fine-tuning
- **Pre-trained on massive data**: Understands fashion concepts from 400M image-text pairs
- **Lightweight**: ViT-B/32 variant runs efficiently even on CPU
- **Open source**: Available via Hugging Face / Xenova Transformers

### Model Details

```
Model:       openai/clip-vit-base-patch32
Library:     @xenova/transformers (ONNX runtime)
Parameters:  ~151M (vision encoder)
Input:       224×224 RGB image (auto-resized)
Output:      512-dimensional L2-normalized vector
Inference:   ~200-500ms per image on CPU
```

---

## Vector Database — pgvector

### What is pgvector?

**pgvector** is a PostgreSQL extension that adds vector similarity search capabilities. It stores high-dimensional vectors alongside regular database columns and provides operators for distance calculations.

### Database Schema

```sql
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Products table
CREATE TABLE products (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  brand      TEXT NOT NULL,
  price      TEXT NOT NULL,
  image_url  TEXT NOT NULL,
  category   TEXT NOT NULL,
  embedding  VECTOR(512)       -- 512-dimensional CLIP embedding
);
```

### Similarity Search Function

```sql
CREATE OR REPLACE FUNCTION match_products (
  query_embedding  VECTOR(512),
  match_threshold  FLOAT,
  match_count      INT,
  filter_category  TEXT
)
RETURNS TABLE (
  id          UUID,
  name        TEXT,
  brand       TEXT,
  price       TEXT,
  image_url   TEXT,
  similarity  FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    products.id,
    products.name,
    products.brand,
    products.price,
    products.image_url,
    1 - (products.embedding <=> query_embedding) AS similarity
  FROM products
  WHERE products.category = filter_category
    AND 1 - (products.embedding <=> query_embedding) > match_threshold
  ORDER BY products.embedding <=> query_embedding
  LIMIT match_count;
$$;
```

### How similarity is calculated

```
Cosine Distance:  d = 1 - cos(θ)    (pgvector's <=> operator)
Similarity Score:  s = 1 - d = cos(θ)

Score = 1.0  →  Identical images
Score = 0.85 →  Very similar (our threshold)
Score = 0.5  →  Somewhat similar
Score = 0.0  →  Completely different
```

The `<=>` operator computes **cosine distance** between two vectors. We convert it to a similarity score (0-1) by subtracting from 1.

---

## Data Flow

### 1. Seeding Products (One-time / Batch)

```
scripts/seed.mjs
       │
       ├── Loads CLIP model (Xenova/clip-vit-base-patch32)
       │
       ├── For each product:
       │     ├── Downloads image from URL
       │     ├── Passes through CLIP vision encoder
       │     ├── Gets 512-dim embedding vector
       │     └── INSERT INTO products (name, brand, price, image_url, category, embedding)
       │
       ├── Outputs product-ids.json (UUID mapping)
       └── Done! Products + embeddings stored in Supabase
```

### 2. Updating Look IDs

```
scripts/update-look-ids.mjs
       │
       ├── Reads product-ids.json
       ├── Reads src/lib/data.ts
       ├── Matches product categories to database UUIDs
       └── Writes updated supabaseId fields into data.ts
```

### 3. User Views a Look (Runtime)

```
User clicks Look 1
       │
       ├── /look/1 page loads
       │     ├── Shows hero full-body image
       │     └── Shows "Products in this look" carousel
       │
       ├── SimilarItems.tsx fires (parallel for each product)
       │     ├── POST /api/similar-products { productId: "fc74e..." }
       │     ├── POST /api/similar-products { productId: "f3e05..." }
       │     └── POST /api/similar-products { productId: "87fca..." }
       │
       ├── API Route (for each request):
       │     ├── Fetch product's embedding from Supabase
       │     ├── Call match_products(embedding, 0.80, 8, category)
       │     ├── pgvector computes cosine distance to all products
       │     ├── Returns top 8 with similarity > 80%
       │     └── Filter out the query product itself
       │
       ├── SimilarItems.tsx:
       │     ├── Deduplicates results across all 3 queries
       │     ├── Sorts by category order (topwear → bottomwear → footwear)
       │     └── Renders grid with optional similarity scores
       │
       └── User sees visually similar items ✨
```

### Performance

| Operation | Time | Runs When |
|-----------|------|-----------|
| CLIP embedding generation | ~300ms/image | Seed time only |
| pgvector similarity search | ~400-500ms | Every query |
| Frontend render | ~50ms | Every query |
| **Total user-facing latency** | **~500ms** | Parallel queries |

---

## Project Structure

```
ai-fashion-app/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home — "For You" looks grid
│   │   ├── look/[id]/page.tsx          # Look detail — carousel + similar items
│   │   ├── catalog/page.tsx            # Full catalog — all seeded products
│   │   └── api/
│   │       └── similar-products/
│   │           └── route.ts            # POST — vector similarity search
│   ├── components/
│   │   ├── SimilarItems.tsx            # Fetches + renders similar items
│   │   └── BottomNav.tsx               # Navigation bar
│   └── lib/
│       ├── data.ts                     # Look + product data (with supabaseIds)
│       └── supabase.ts                 # Supabase client initialization
├── scripts/
│   ├── seed.mjs                        # Seeds products + CLIP embeddings
│   ├── update-look-ids.mjs             # Maps UUIDs into data.ts
│   └── product-ids.json                # Generated UUID mapping
├── .env.local                          # Supabase URL + Anon Key
└── package.json
```

---

## Setup & Running

### Prerequisites

- Node.js 18+
- Supabase project with pgvector enabled

### 1. Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Database Setup

Run in Supabase SQL Editor:
```sql
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  embedding VECTOR(512)
);

-- Create similarity search function
CREATE OR REPLACE FUNCTION match_products (
  query_embedding VECTOR(512),
  match_threshold FLOAT,
  match_count INT,
  filter_category TEXT
)
RETURNS TABLE (
  id UUID, name TEXT, brand TEXT, price TEXT, image_url TEXT, similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT products.id, products.name, products.brand, products.price,
         products.image_url, 1 - (products.embedding <=> query_embedding) AS similarity
  FROM products
  WHERE products.category = filter_category
    AND 1 - (products.embedding <=> query_embedding) > match_threshold
  ORDER BY products.embedding <=> query_embedding
  LIMIT match_count;
$$;
```

### 3. Install & Seed

```bash
npm install
node scripts/seed.mjs          # Generate embeddings + insert into DB
node scripts/update-look-ids.mjs  # Map IDs into data.ts
```

### 4. Run

```bash
npm run dev
# Open http://localhost:3000
```

---

## Production Architecture

In production, the manual scripts are replaced by automated pipelines:

### Current POC vs Production

```
POC:
  seed.mjs (manual) → Supabase → API route → Frontend

Production:
  Admin Panel → Upload API → Background Job → Supabase → API route → Frontend
```

### Key Differences

| Aspect | POC | Production |
|--------|-----|-----------|
| Adding products | Edit `seed.mjs`, run script | Admin dashboard or API |
| Embedding generation | `seed.mjs` runs CLIP locally | Background worker / serverless function |
| Look data | Hardcoded in `data.ts` | Stored in database, fetched dynamically |
| Product IDs | `update-look-ids.mjs` patches code | Products have DB IDs from creation |
| Scaling | Single machine, ~40 products | Dedicated GPU workers, millions of products |
| Image storage | External URLs (Myntra CDN) | Own CDN (S3/CloudFront) |

### Production Data Flow

```
┌──────────────┐     ┌─────────────────────┐     ┌──────────────┐
│ Admin Panel   │────→│ Product Upload API   │────→│ Image Storage │
│ (or Bulk CSV) │     │ POST /api/products   │     │ (S3 + CDN)   │
└──────────────┘     └─────────┬───────────┘     └──────────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │ Background Job Queue │
                    │ (Bull/SQS/Pub-Sub)   │
                    └─────────┬───────────┘
                              │
                              ↓
                    ┌─────────────────────┐
                    │ CLIP Embedding       │
                    │ Worker               │
                    │ (GPU instance or     │
                    │  serverless with GPU)│
                    └─────────┬───────────┘
                              │
                              ↓
                    ┌─────────────────────┐
                    │ Supabase / Postgres  │
                    │ + pgvector           │
                    │ (or Pinecone/Weaviate│
                    │  for massive scale)  │
                    └─────────────────────┘
```

### Production Optimizations

1. **Dedicated Vector DB** (for millions of products):
   - Pinecone, Weaviate, or Qdrant instead of pgvector
   - Approximate Nearest Neighbor (ANN) indexes for sub-10ms queries

2. **GPU-Accelerated Embeddings**:
   - Run CLIP on AWS Lambda with GPU, Google Cloud Run GPU, or a dedicated GPU server
   - Batch process multiple images in parallel

3. **Caching**:
   - Redis cache for popular product similarity results
   - CDN edge caching for API responses

4. **Better Models**:
   - Fine-tune CLIP on your specific fashion catalog
   - Use fashion-specific models like FashionCLIP
   - Higher dimension embeddings (768 or 1024) for finer distinctions

5. **Real-time Updates**:
   - Webhook triggers embedding generation on product creation
   - Incremental inserts (no full table clears)

---

## Similarity Threshold

The similarity threshold controls how strict the matching is:

```
Threshold = 0.80 (80%)  →  More results, looser matching
Threshold = 0.85 (85%)  →  Balanced
Threshold = 0.90 (90%)  →  Very strict, only near-identical items
```

Configured in `src/app/api/similar-products/route.ts`:
```typescript
match_threshold: 0.80,  // Adjust this value
```

---

## Local build (POC)
```
node scripts/seed.mjs && node scripts/update-look-ids.mjs
```

## License

This project is a proof-of-concept / technical demonstration.
