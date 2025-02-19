// Get elements
const video = document.getElementById('video'),
videoControls = document.getElementById('video-controls'),

playButton = document.getElementById('play'),

elapsed = document.getElementById('elapsed'),
duration = document.getElementById('duration'),
progressBar = document.getElementById('progress-bar'),
seek = document.getElementById('seek'),
seekTooltip = document.getElementById('seek-tooltip');


// Check if browser supports canPlayType method and disable default controls if so
const videoWorks = !!document.createElement('video').canPlayType;
if (videoWorks) {
    video.controls = false;
    videoControls.classList.remove('hidden');
}


// togglePlay toggles the playback state of the video.
// If the video playback is paused or ended, the video is played
// otherwise, the video is paused
function togglePlay() {
  if (video.paused || video.ended) {
    video.play();
    playButton.title = 'Pause';
    playButton.innerHTML = '<span>&#x2590;&#x2590;</span>';
  } else {
    video.pause();
    playButton.title = 'Play';
    playButton.innerHTML = '&#x25BA';
  }
}
playButton.addEventListener('click', togglePlay);


// formatTime takes a time length in seconds and returns the time in
// minutes and seconds
function formatTime(timeInSeconds) {
  const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

  return {
    minutes: result.substr(3, 2),
    seconds: result.substr(6, 2),
  };
};


// initializeVideo sets the video duration, and maximum value of the
// progressBar
function initializeVideo() {
  const videoDuration = Math.round(video.duration);
  seek.setAttribute('max', videoDuration);
  progressBar.setAttribute('max', videoDuration);
  const time = formatTime(videoDuration);
  duration.innerText = `${time.minutes}:${time.seconds}`;
  duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
}
video.addEventListener('loadedmetadata', initializeVideo);


// updateTimeElapsed indicates how far through the video
// the current playback is
function updateTimeElapsed() {
  const time = formatTime(Math.round(video.currentTime));
  elapsed.innerText = `${time.minutes}:${time.seconds}`;
  elapsed.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
}
video.addEventListener('timeupdate', updateTimeElapsed);


// updateProgress indicates how far through the video
// the current playback is by updating the progress bar
function updateProgress() {
  seek.value = Math.floor(video.currentTime);
  progressBar.value = Math.floor(video.currentTime);
}
video.addEventListener('timeupdate', updateProgress);


// updateSeekTooltip uses the position of the mouse on the progress bar to
// roughly work out what point in the video the user will skip to if
// the progress bar is clicked at that point
function updateSeekTooltip(event) {
  const skipTo = Math.round((event.offsetX / event.target.clientWidth) * parseInt(event.target.getAttribute('max'), 10));
  seek.setAttribute('data-seek', skipTo)
  const t = formatTime(skipTo);
  seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
  const rect = video.getBoundingClientRect();
  seekTooltip.style.left = `${event.clientX-(rect.left)}px`;
}
seek.addEventListener('mousemove', updateSeekTooltip);


// skipAhead jumps to a different point in the video when
// the progress bar is clicked
function skipAhead(event) {
  const skipTo = event.target.dataset.seek ? event.target.dataset.seek : event.target.value;
  video.currentTime = skipTo;
  progressBar.value = skipTo;
  seek.value = skipTo;
}
seek.addEventListener('input', skipAhead);


// Play/Pause video when clicked
video.addEventListener('click', togglePlay);

// hideControls hides the video controls when not in use
// if the video is paused, the controls must remain visible
function hideControls() {
  if (video.paused) {
    return;
  }

  videoControls.classList.add('hidden');
}

// showControls displays the video controls
function showControls() {
  videoControls.classList.remove('hidden');
}

// Register event handlers for showing and hiding the controls
video.addEventListener('mouseenter', showControls);
video.addEventListener('mouseleave', hideControls);
videoControls.addEventListener('mouseenter', showControls);
videoControls.addEventListener('mouseleave', hideControls);
