import base_url from '../base_url';

export default function getReplyFileNames(replyId) {
  let url = base_url + `reply/fileNames/${replyId}`;
  return fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then((res) => {
    return res.json();
  });
}
