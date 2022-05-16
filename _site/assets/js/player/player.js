'use strict';
let videoPlayerFunc = {
    videoFullScreen: undefined,
    playVideo: function (el) {
        let video = videoPlayerFunc.findVideoElement(el);
        let container = $(el).parents('.container-video')[0];

        video.play();
        $(video).next('.video-player-controls').find('i.play-video').css('display', 'none');
        $(video).next('.video-player-controls').find('i.pause-video').css('display', 'block');
        let btnPlayMid = $(container).find('i.play-center-video')[0];
        $(btnPlayMid).css('display', 'none');
    },
    pauseVideo: function (el) {
        let video = videoPlayerFunc.findVideoElement(el);
        let container = $(el).parents('.container-video')[0];

        video.pause();
        $(video).next('.video-player-controls').find('i.play-video').css('display', 'block');
        $(video).next('.video-player-controls').find('i.pause-video').css('display', 'none');
        let btnPlayMid = $(container).find('i.play-center-video')[0];
        $(btnPlayMid).css('display', 'block');
    },
    updateProgessBarVideo: function (video) {
        let progressBarPosition = video.currentTime / video.duration;
        let progressBarDiv = $(video).next('.video-player-controls').find('.progess-bar-video-player');
        progressBarDiv.css("width", progressBarPosition * 100 + "%");
        videoPlayerFunc.updateTimerVideo(video);

        if (video.ended) {
            videoPlayerFunc.pauseVideo(video);
        }
    },
    updateTimerVideo: function (video) {
        let currentTimeSpan = $(video).next('.video-player-controls').find('.current-time-video');
        let durationTimeSpan = $(video).next('.video-player-controls').find('.duration-time-video');

        let currentHour = this.textFormatDurationVideo(Math.floor(video.currentTime / 3600));
        let currentMinute = this.textFormatDurationVideo(Math.floor((video.currentTime / 60) % 60));
        let currentSecond = this.textFormatDurationVideo(Math.floor(video.currentTime % 60));
        currentTimeSpan.text(currentHour > 0 ? currentHour + ":" : "" + currentMinute + ":" + currentSecond);

        let durationHour = this.textFormatDurationVideo(Math.floor(video.duration / 3600));
        let durationMinute = this.textFormatDurationVideo(Math.floor((video.duration / 60) % 60));
        let durationSecond = this.textFormatDurationVideo(Math.floor(video.duration % 60));
        durationTimeSpan.text(durationHour > 0 ? durationHour + ":" : "" + durationMinute + ":" + durationSecond);
    },
    openVolume: function (el) {
        let video = videoPlayerFunc.findVideoElement(el);
        $(video).next('.video-player-controls').find('i.volume-close').css('display', 'none');
        $(video).next('.video-player-controls').find('i.volume-open').css('display', 'block');

        let container = $(el).parents('.container-video')[0];
        let inputVolume = $(container).find('input[type="range"]')[0];
        video.volume = $(inputVolume).val() / 10;
    },
    closeVolume: function (el) {
        let video = videoPlayerFunc.findVideoElement(el);
        video.volume = 0;
        $(video).next('.video-player-controls').find('i.volume-close').css('display', 'block');
        $(video).next('.video-player-controls').find('i.volume-open').css('display', 'none');
    },
    soundVideoChanged: function (el) {
        let video = videoPlayerFunc.findVideoElement(el);
        let volume = $(el).val();
        if (volume === 0) {
            videoPlayerFunc.closeVolume(el)
        } else {
            videoPlayerFunc.openVolume(el)
        }
        video.volume = volume / 10;
    },
    openFullScreen: function (el) {
        let container = $(el).parents('.container-video')[0];

        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
            container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }

        videoPlayerFunc.videoFullScreen = $(container).find('.video')[0];
        $(container).find('i.open-full-screen').css('display', 'none');
        $(container).find('i.close-full-screen').css('display', 'block');
    },
    closeFullScreen: function (el) {
        let container = $(el).parents('.container-video')[0];

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        videoPlayerFunc.videoFullScreen = undefined;
        $(container).find('i.open-full-screen').css('display', 'block');
        $(container).find('i.close-full-screen').css('display', 'none');
    },

    fullScreenChange: function () {
        if (document.webkitFullscreenElement === null && videoPlayerFunc.videoFullScreen !== undefined) {
            let container = $(videoPlayerFunc.videoFullScreen).parents('.container-video')[0];
            $(container).find('i.open-full-screen').css('display', 'block');
            $(container).find('i.close-full-screen').css('display', 'none');
            videoPlayerFunc.videoFullScreen = undefined;
        }
    },
    scrubProgressBarVideo: function (el, e) {
        let video = videoPlayerFunc.findVideoElement(el);
        let scrub = (e.offsetX / el.offsetWidth) * video.duration;

        video.currentTime = scrub;
    },
    btnPlayCenterVideo: function (el) {
        let container = $(el).parents('.container-video')[0];
        let btnPlay = $(container).find('i.play-video')
        this.playVideo(btnPlay);
    },
    videoPlayPause: function (video) {
        if (video.paused) {
            videoPlayerFunc.playVideo(video);
        } else {
            videoPlayerFunc.pauseVideo(video);
        }
    },
    findVideoElement(el) {
        let container = $(el).parents('.container-video')[0];
        return $(container).find('.video')[0];
    },
    textFormatDurationVideo: function (time) {
        if (time < 10) {
            return "0" + time;
        }
        return time;
    }
};

let videoPlayerListener = {
    onLoad: function () {
        videoPlayerListener.onClick();
        videoPlayerListener.onChange();
        videoPlayerListener.onTimeUpdate();
        videoPlayerListener.fullScreenChange();
    },
    onClick: function () {
        $('i.play-video').off('click').click(function () {
            videoPlayerFunc.playVideo(this);
        });
        $('i.pause-video').off('click').click(function () {
            videoPlayerFunc.pauseVideo(this);
        });
        $('i.volume-open').off('click').click(function () { //
            videoPlayerFunc.closeVolume(this);
        });
        $('i.volume-close').off('click').click(function () { //
            videoPlayerFunc.openVolume(this);
        });
        $('i.open-full-screen').off('click').click(function () {
            videoPlayerFunc.openFullScreen(this);
        });
        $('i.close-full-screen').off('click').click(function () {
            videoPlayerFunc.closeFullScreen(this);
        });
        $('.bar-video-player').off('click').click(function (e) {
            videoPlayerFunc.scrubProgressBarVideo(this, e);
        });
        $('i.play-center-video').off('click').click(function () {
            videoPlayerFunc.btnPlayCenterVideo(this);
        });
        $('video.video').off('click').click(function () {
            videoPlayerFunc.videoPlayPause(this);
        });
    },
    onChange: function () {
        $('.sound-video-player input[type="range"]').change(function () {
            videoPlayerFunc.soundVideoChanged(this);
        });
    },
    onTimeUpdate: function () {
        $('video.video').off('timeupdate').bind('timeupdate', function () {
            videoPlayerFunc.updateProgessBarVideo(this);
        })
    },
    fullScreenChange: function () {
        $(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange')
            .bind('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function () {
                videoPlayerFunc.fullScreenChange();
            });
    }
};

$(document).ready(function () {
    $(window).ready(function () {
        videoPlayerListener.onLoad();
        $('video.video').each(function () {
            videoPlayerFunc.updateProgessBarVideo(this);
        });
    });
});