export const findTaskId = comment => {
  const ref = comment.match(/(refs#\d+)/);
  if (ref) {
    return  asanaRef[0].split('#')[1];
  }
  
  return null;
}