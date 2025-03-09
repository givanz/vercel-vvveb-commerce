import OpengraphImage from 'components/opengraph-image';
import { getCollection } from 'lib/vvveb';

export const runtime = 'edge';

export default async function Image({ params }: { params: { collection: string } }) {
  const collection = await getCollection(params.collection);
  const name = collection?.name;//collection?.seo?.og?.title || collection?.name;

  return await OpengraphImage({ name });
}
