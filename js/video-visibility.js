(function () {
  const videoFrames = Array.from(
    document.querySelectorAll('iframe[src*="youtube.com/embed/"]')
  );

  if (!videoFrames.length) return;

  const visibleFrames = new WeakMap();

  function sendCommand(frame, command) {
    if (!frame.contentWindow) return;

    frame.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: command, args: [] }),
      '*'
    );
  }

  function updatePlayback(frame) {
    const shouldPlay =
      document.visibilityState === 'visible' && visibleFrames.get(frame);

    sendCommand(frame, shouldPlay ? 'playVideo' : 'pauseVideo');
  }

  videoFrames.forEach(function (frame) {
    visibleFrames.set(frame, false);

    window.setTimeout(function () {
      updatePlayback(frame);
    }, 300);
    window.setTimeout(function () {
      updatePlayback(frame);
    }, 1000);

    frame.addEventListener('load', function () {
      // Repeat the command after the YouTube player has finished initialising.
      window.setTimeout(function () {
        updatePlayback(frame);
      }, 300);
      window.setTimeout(function () {
        updatePlayback(frame);
      }, 1000);
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const isVisible =
            entry.isIntersecting && entry.intersectionRatio >= 0.35;

          if (visibleFrames.get(entry.target) === isVisible) return;

          visibleFrames.set(entry.target, isVisible);
          updatePlayback(entry.target);
        });
      },
      { threshold: [0, 0.35, 1] }
    );

    videoFrames.forEach(function (frame) {
      observer.observe(frame);
    });
  } else {
    videoFrames.forEach(function (frame) {
      visibleFrames.set(frame, true);
      updatePlayback(frame);
    });
  }

  document.addEventListener('visibilitychange', function () {
    videoFrames.forEach(updatePlayback);
  });
})();
