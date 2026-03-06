import Form from './form';

function ReservarPage(): React.ReactNode {
  return (
    <main
      style={{
        backgroundImage: 'url(/assets/refugio/geral/refugio-1.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <section className='w-full h-full grid place-items-center min-h-container bg-black/50'>
        <div className='px-6 w-full grid place-items-center'>
          <Form />
        </div>
      </section>
    </main>
  );
}

export default ReservarPage;
