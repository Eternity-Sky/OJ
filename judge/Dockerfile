FROM ubuntu:20.04

# 避免交互式提示
ENV DEBIAN_FRONTEND=noninteractive

# 安装必要的包
RUN apt-get update && apt-get install -y \
    g++ \
    python3 \
    openjdk-11-jdk \
    time \
    && rm -rf /var/lib/apt/lists/*

# 创建非特权用户
RUN useradd -m -d /judge judge
USER judge
WORKDIR /judge

# 设置运行时环境
ENV PATH="/usr/bin:/bin:/usr/local/bin"
ENV LANG=C.UTF-8

# 复制评测脚本
COPY --chown=judge:judge run.sh /judge/
RUN chmod +x /judge/run.sh

ENTRYPOINT ["/judge/run.sh"]
