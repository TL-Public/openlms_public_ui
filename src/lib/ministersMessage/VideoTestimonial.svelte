<script>
    import VideoPlayer from '$lib/Components/VideoPlayer.svelte';
    import { extractYouTubeVideoId } from '$lib/data.js';
  
    export let data = {};
    export let token = '';
  </script>
  
  <div class="flex flex-col md:flex-row w-full gap-4 md:gap-2">
    <div class="md:w-3/4 w-full">
      <div class="bg-accent rounded-lg overflow-hidden">
        <div class="w-full aspect-video  rounded-lg ">
         <!-- <VideoPlayer {token} videoId={data.videoExtId} /> -->
          <VideoPlayer videoId={extractYouTubeVideoId(data?.url)} videoMetaData={{videoUuid: data.videoExtId}} />
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-between md:w-1/4 w-full mt-4 md:mt-0">
      <img src="DoubleQuote.svg" alt="message quotes" class="md:w-20 w-9 mb-4" />
      <div class="w-full border-l-2 border-s-primary px-2 pt-4">
        <p class="text-sm font-bold text-darkGray">
          {data.name}
        </p>
        <p class="text-xs">
          {data.designation}
        </p>
      </div>
    </div>
  </div>
  
  



    
