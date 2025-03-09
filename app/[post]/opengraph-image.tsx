import OpengraphImage from 'components/opengraph-image';
import { getPage } from 'lib/vvveb';

export const runtime = 'edge';

export default async function Image({ params }: { params: { page: string } }) {
  const page = await getPage(params.page);
  const name = page.seo?.og?.title || page.name;

  return await OpengraphImage({ name });
}
