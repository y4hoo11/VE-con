FROM osrf/ros:humble-desktop

# インタラクティブモードの警告を防止
ENV DEBIAN_FRONTEND=noninteractive

# 必要なパブリックパッケージとツールのインストール
RUN apt-get update && apt-get install -y \
    python3-pip \
    ros-humble-nav2-bringup \
    ros-humble-navigation2 \
    ros-humble-slam-toolbox \
    ros-humble-rmw-cyclonedds-cpp \
    ros-humble-turtlebot3* \
    python3-colcon-common-extensions \
    git \
    net-tools \
    iputils-ping \
    && rm -rf /var/lib/apt/lists/*

# ワークスペースディレクトリの設定
WORKDIR /workspace/ros2_ws

# 起動時の環境変数読み込み設定
RUN echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
RUN echo "source /workspace/ros2_ws/install/setup.bash" >> ~/.bashrc

CMD ["bash"]