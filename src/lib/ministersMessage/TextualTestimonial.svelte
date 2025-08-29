<script>
    export let data = {};
  </script>
  
  <div class="flex flex-col md:flex-row items-center w-full gap-4">
    <div class="md:w-1/3 w-full flex justify-center">
      <div class="md:w-52 md:h-52 w-32 h-32 bg-accent-light p-1 rounded-md">
        <img
          src={data.img}
          alt={data.name}
          class="w-full h-full object-cover rounded"
        />
      </div>
    </div>
    <div class="flex flex-col justify-center md:w-2/3 w-full mt-4 md:mt-0">
      <img src="DoubleQuote.svg" alt="message quotes" class="md:w-20 md:mb-4 w-9 my-3" />
      <p class="text-xs sm:text-sm leading-loose md:leading-relaxed mb-6">
        {@html data.testimonialText}
      </p>
      <div class="flex flex-col items-start md:items-end">
        <div class="md:w-1/2 w-3/4 border-l-2 border-s-primary px-2 pt-4">
          <p class="text-sm font-bold text-darkGray">
            {data.name}
          </p>
          <p class="text-xs">
            {data.designation}
          </p>
        </div>
      </div>
    </div>
  </div>