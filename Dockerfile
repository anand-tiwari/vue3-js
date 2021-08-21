FROM asia.gcr.io/nonprod-utility-233414/base-images/nginx_openresty:nginx_openresty-alpine-1.0.1

RUN mkdir -p /opt/pyeongyang-ui/www/search-ui/1.0.0-1 \
  && mkdir -p /opt/pyeongyang-search-ui/params/ \
  && mkdir -p /opt/pyeongyang-search-ui/sites/

WORKDIR /opt/pyeongyang-ui/www/search-ui

COPY target/com.gdn.pyeongyang-pyeongyang-search-ui/1.0.0-1 /opt/pyeongyang-ui/www/search-ui/1.0.0-1

RUN ln -s 1.0.0-1 latest

RUN chown -R nginx:nginx /opt/pyeongyang-search-ui/ \
  && chmod -R 766 /opt/pyeongyang-search-ui/

EXPOSE 8080

CMD ["/opt/openresty/bin/openresty", "-g", "daemon off;"]
