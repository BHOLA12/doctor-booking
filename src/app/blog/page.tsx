export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4v4h4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h3M7 12h10M7 16h10" />
        </svg>
      </div>
      <h1 className="text-3xl font-black mb-4">DocBook Health Blog</h1>
      <p className="text-muted-foreground max-w-md text-lg">
        Our medical experts are busy writing helpful health tips for you. Check back shortly for our latest articles!
      </p>
    </div>
  );
}
