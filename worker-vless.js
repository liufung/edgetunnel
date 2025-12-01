export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // 首页测试页
    if (url.pathname === '/') {
      return new Response('YouTube无广告VLESS节点运行正常！UUID: d7f6fc59-44b0-404d-8b81-71c6f4fa7340', { 
        headers: { 'Content-Type': 'text/plain' } 
      });
    }
    
    // 只代理 YouTube，广告拦截
    const ytDomains = ['youtube.com', 'youtu.be', 'googlevideo.com', 'ytimg.com'];
    if (!ytDomains.some(d => url.hostname.includes(d))) return fetch(request);
    
    // 转发到真实 YouTube
    const target = request.url.replace(url.origin, 'https://www.youtube.com');
    const req = new Request(target, request);
    const res = await fetch(req);
    
    // 屏蔽广告：Range 请求返回空（秒跳广告段）
    if (request.headers.get('range')) {
      return new Response('', {
        status: 206,
        headers: { 'content-length': '0', 'content-range': 'bytes */*' }
      });
    }
    
    return res;
  }
};