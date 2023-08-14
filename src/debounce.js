export function debounce(callback, delaySeconds) {
  let timer = null;

  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback.apply(this, arguments);
    }, delaySeconds * 1000);
  };
}
