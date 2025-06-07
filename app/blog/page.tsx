
import { getPages } from 'lib/vvveb';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Blog',
  description: 'Latest posts'
};

export default async function Pages(props: { params: Promise<{ }> }) {
  const params = await props.params;
  const pages = await getPages("post");

  if (!pages) return notFound();
  
  return (
    <>
    {pages.map((page, i) => (
      <div key={page.slug}>
         <Link
          className=""
          href={`/${page.slug}`}
          prefetch={true}
        >
          <h2 className="mb-8 text-5xl font-bold">{page.name}</h2>
          <img className="mb-8 rounded-lg" src={`${process.env.VVVEB_URL}${page.image}`} />
        </Link>
        <div className="mb-8" dangerouslySetInnerHTML={{ __html: page.content }} />

        <Link
        className="text-blue-600"
        href={`/${page.slug}`}
        prefetch={true}
       >
        Read more
       </Link>

        <hr className="mt-6 mb-8"/>
      </div>
    ))}
    </>
  );
}
