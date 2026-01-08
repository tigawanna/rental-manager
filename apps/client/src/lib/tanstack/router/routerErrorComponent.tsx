interface RouterErrorComponentProps {
  error: Error;
}

export function RouterErrorComponent({ error }: RouterErrorComponentProps) {
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md border border-error bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error.name}
          </h2>
          <p className="text-base-content/70">{error.message}</p>
          {error.stack && (
            <div className="collapse collapse-arrow bg-base-200 mt-2">
              <input type="checkbox" />
              <div className="collapse-title text-sm font-medium">View stack trace</div>
              <div className="collapse-content">
                <pre className="text-xs overflow-x-auto">{error.stack}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
