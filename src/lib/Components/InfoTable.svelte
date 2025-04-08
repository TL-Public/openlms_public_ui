<!-- 
  InfoTable Component
  -------------------
  - Expects a single prop: `info`
  - `info` is an object containing:
    - `title`: The section title
    - `icon`: SVG path data for the icon
    - `fields`: An array of field objects
  - Each field object has:
    - `label`: Display name for the field
    - `key`: Identifier to access value from `info`
    - `format` (optional): Function to transform/display field value 
    - 'value': Value to be displayed
  - If `format` function is provided, it will be applied to the field's value
  - If a value is missing, `'-'` will be displayed by default
-->

<script>
    export let info;
  </script>
  
  <div>
    <h2 class="text-lg font-semibold text-darkGray mb-4 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 mr-2 text-[#3DC2EE]"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d={info?.icon} />
      </svg>
      <span class="heading-L">{info?.title}</span>
    </h2>
  
    <div class="rounded-lg p-5 space-y-4 border border-gray-200">
      {#each info?.fields as field, index}
        <div class="grid grid-cols-[1fr_auto_1fr] gap-2 items-start">
          <div class="text-xs sm:text-sm font-medium text-darkGray break-words">
            {field?.label}
          </div>
          <div class="text-xs sm:text-sm font-medium text-darkGray text-center">:</div>
          <div class="text-xs sm:text-sm text-darkGray break-words break-all">
            {#if field?.format}
              {field?.format(field?.value, info)}
            {:else}
              {field?.value || '-'}
            {/if}
          </div>
        </div>
        {#if index !== info?.fields?.length - 1}
          <div class="border-b border-gray-200"></div>
        {/if}
      {/each}
    </div>
  </div>