#!/bin/bash

# 设置限制
ulimit -t 5  # CPU时间限制（秒）
ulimit -v 512000  # 虚拟内存限制（KB）
ulimit -f 1024  # 文件大小限制（KB）

# 获取参数
LANGUAGE=$1
SOURCE_FILE=$2
INPUT_FILE=$3
OUTPUT_FILE=$4
TIME_LIMIT=$5
MEMORY_LIMIT=$6

# 编译和运行函数
compile_and_run() {
    case $LANGUAGE in
        "cpp")
            g++ -O2 -w -std=c++17 $SOURCE_FILE -o program
            if [ $? -ne 0 ]; then
                echo "Compilation Error"
                exit 1
            fi
            /usr/bin/time -f "%e %M" ./program < $INPUT_FILE > $OUTPUT_FILE 2>time.txt
            ;;
        "python")
            /usr/bin/time -f "%e %M" python3 $SOURCE_FILE < $INPUT_FILE > $OUTPUT_FILE 2>time.txt
            ;;
        "java")
            javac $SOURCE_FILE
            if [ $? -ne 0 ]; then
                echo "Compilation Error"
                exit 1
            fi
            /usr/bin/time -f "%e %M" java Main < $INPUT_FILE > $OUTPUT_FILE 2>time.txt
            ;;
        *)
            echo "Unsupported Language"
            exit 1
            ;;
    esac
}

# 运行程序
compile_and_run

# 检查运行时间和内存使用
TIME_USED=$(awk '{print $1}' time.txt)
MEMORY_USED=$(awk '{print $2}' time.txt)

# 检查是否超时或超内存
if (( $(echo "$TIME_USED > $TIME_LIMIT" | bc -l) )); then
    echo "Time Limit Exceeded"
    exit 2
fi

if (( $(echo "$MEMORY_USED > $MEMORY_LIMIT" | bc -l) )); then
    echo "Memory Limit Exceeded"
    exit 3
fi

# 输出运行结果
echo "Time: $TIME_USED"
echo "Memory: $MEMORY_USED"
exit 0
