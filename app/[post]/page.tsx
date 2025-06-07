import type { Metadata } from 'next';

import { getPage } from 'lib/vvveb';
import { notFound } from 'next/navigation';

export async function generateMetadata(props: {
  params: Promise<{ post: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = await getPage(params.post);

  if (!page) return notFound();

  return {
    title: page.name,
    description: page.content,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: 'article'
    }
  };
}

export default async function Page(props: { params: Promise<{ post: string }> }) {
  const params = await props.params;
  const page = await getPage(params.post);

  if (!page) return notFound();
  
  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">{page.name}</h1>
	    <img className="mb-8 rounded-lg" src={`${process.env.VVVEB_URL}${page.image}`} />
      <div className="mb-8" dangerouslySetInnerHTML={{__html: page.content}} />
      <p className="text-sm italic">
        {`This post was last updated on ${new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(new Date(page.updatedAt))}.`}
      </p>
    </>
  );
}
