import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
        }

        // 1. Fetch the product's stored embedding and category from the database
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('embedding, category')
            .eq('id', productId)
            .single();

        if (fetchError || !product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // 2. Use category-filtered search (works great with standardized catalog images)
        const { data: similarItems, error: searchError } = await supabase.rpc('match_products', {
            query_embedding: product.embedding,
            match_threshold: 0.80,
            match_count: 8,
            filter_category: product.category,
        });

        if (searchError) throw searchError;

        // 3. Filter out the queried product itself from results
        const filtered = (similarItems || []).filter(
            (item: { id: string }) => item.id !== productId
        );

        return NextResponse.json({ items: filtered }, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Similar products search error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
