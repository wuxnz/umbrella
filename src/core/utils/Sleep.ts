// The infamous sleep function
// mostly used for testing
function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export default sleep;
