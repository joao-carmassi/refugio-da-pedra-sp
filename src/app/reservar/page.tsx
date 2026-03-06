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
        <div className='p-6 md:p-12 w-full grid place-items-center'>
          <Form />
        </div>
      </section>
    </main>
  );
}

export default ReservarPage;
