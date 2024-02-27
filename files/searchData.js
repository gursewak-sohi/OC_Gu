document.addEventListener("alpine:init", () => {
  Alpine.data('searchComponent', () => ({
      isLoadingVideos: false,
      isLoadingAudios: false,
      videos: [],
      audios: [],
      fetchVideos(profileId) {
          this.isLoadingVideos = true;
          fetch(`https://www.onlinecasting.dk/api/profile_videos.asp?profileid=${profileId}`)
              .then(response => response.json())
              .then(data => {
                  this.videos = data.videos;
                  this.$nextTick(() => {
                    const fancyBoxItems = this.videos.map(video => ({
                        src: video.url,
                        type: 'iframe',
                        width: 960,
                        height: 540,
                        opts: {
                          iframe: {
                              preload: false,
                              css: {
                                background: 'black', 
                            }
                          }
                      }
                    }));
                    $.fancybox.open(fancyBoxItems, {
                        loop: true,
                    });
                });
              })
              .catch(error => {
                  console.error("Error fetching video data:", error);
              })
              .finally(() => {
                  this.isLoadingVideos = false;
              });
      },
      fetchAudios(profileId) {
        this.isLoadingAudios = true;
        fetch(`https://www.onlinecasting.dk/api/profile_audio.asp?profileid=${profileId}`)
            .then(response => response.json())
            .then(data => {
                this.audios = data.audio;
                this.$nextTick(() => {
                  const fancyBoxItems = this.audios.map(audio => ({
                      src: audio.src,
                      type: 'iframe',
                      width: 340,
                      height: 200,
                      opts: {
                        iframe: {
                            preload: false,
                            css: {
                              background: 'white', 
                          }
                        }
                    }
                  }));
                  $.fancybox.open(fancyBoxItems, {
                      loop: true,
                  });
              });
            })
            .catch(error => {
                console.error("Error fetching video data:", error);
            })
            .finally(() => {
                this.isLoadingAudios = false;
            });
    },
      init() {
          // Optional
      }
  }));
});