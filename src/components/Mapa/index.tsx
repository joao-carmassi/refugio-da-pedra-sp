function Mapa() {
  return (
    <section className="w-full max-w-7xl px-6 md:px-12 py-6 md:py-12 gap-4 mx-auto flex justify-between items-center flex-col">
      <h2 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white">
        Localização
      </h2>
      <p className="mb-3 text-center md:w-4/5 text-lg text-gray-800 dark:text-neutral-400">
        A apenas 1,5 km do pé da Pedra do Baú, um dos destinos mais incríveis da
        Serra da Mantiqueira. Aqui, você estará cercado por trilhas
        deslumbrantes, montanhas imponentes e vistas de tirar o fôlego,
        perfeitas para quem busca aventura e contato com a natureza.
      </p>
      <iframe
        title="Google maps"
        className="w-full h-[30rem] lg:h-[35rem]"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.3469548877215!2d-45.66375792387372!3d-22.67812457941675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cc7de7a1085cab%3A0xfbaf5cb9454d9009!2sRef%C3%BAgio%20da%20Pedra%20Sp!5e0!3m2!1spt-BR!2sbr!4v1741976848192!5m2!1spt-BR!2sbr"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>
  );
}

export default Mapa;
