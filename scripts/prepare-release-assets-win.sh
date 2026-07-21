#!/usr/bin/env bash
# prepare-release-assets-win.sh
#
# 仅处理 Windows 构建产物的发布脚本（x64 + ARM64）
# 用于自定义构建（Windows-only），不像 prepare-release-assets.sh 那样校验 macOS/Linux/web-cli 产物
#
# Usage:
#   ./scripts/prepare-release-assets-win.sh [ARTIFACTS_DIR] [OUTPUT_DIR]
#
# Defaults:
#   ARTIFACTS_DIR = build-artifacts
#   OUTPUT_DIR    = release-assets

set -euo pipefail

ARTIFACTS_DIR="${1:-build-artifacts}"
OUTPUT_DIR="${2:-release-assets}"

rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# ---------------------------------------------------------------------------
# 1) 复制所有 Windows 安装包（.exe, .msi, .zip）
# ---------------------------------------------------------------------------
echo "==> 复制 Windows 安装包从 $ARTIFACTS_DIR ..."
DISTRIBUTABLES=()
while IFS= read -r file; do
  DISTRIBUTABLES+=("$file")
done < <(find "$ARTIFACTS_DIR" -type f \( \
  -name "*.exe" -o \
  -name "*.msi" -o \
  -name "*.zip" \
\) | sort)

DUPLICATE_BASENAMES=$(for file in "${DISTRIBUTABLES[@]}"; do basename "$file"; done | sort | uniq -d || true)
if [ -n "$DUPLICATE_BASENAMES" ]; then
  echo "::error::发现重复的安装包文件名，在平铺输出中会被覆盖:"
  echo "$DUPLICATE_BASENAMES"
  exit 1
fi

for file in "${DISTRIBUTABLES[@]}"; do
  cp -f "$file" "$OUTPUT_DIR/"
done
echo "已复制 ${#DISTRIBUTABLES[@]} 个文件"

# ---------------------------------------------------------------------------
# 2) 收集 Windows 更新元数据（用于 electron-updater）
# ---------------------------------------------------------------------------
echo "==> 收集 Windows 更新元数据 ..."

WIN_X64_LATEST=$(find "$ARTIFACTS_DIR" -type f -path "*/windows-build-x64/*" -name "latest.yml" | sort | head -n 1 || true)
WIN_ARM64_LATEST=$(find "$ARTIFACTS_DIR" -type f -path "*/windows-build-arm64/*" -name "latest.yml" | sort | head -n 1 || true)

# ---------------------------------------------------------------------------
# 3) 写入规范化的更新元数据
# ---------------------------------------------------------------------------
echo "==> 写入规范化的更新元数据 ..."

[ -n "$WIN_X64_LATEST" ]  && cp -f "$WIN_X64_LATEST"  "$OUTPUT_DIR/latest.yml"
[ -n "$WIN_ARM64_LATEST" ] && cp -f "$WIN_ARM64_LATEST" "$OUTPUT_DIR/latest-win-arm64.yml"

# ---------------------------------------------------------------------------
# 4) 校验必需的更新元数据
# ---------------------------------------------------------------------------
echo "==> 校验必需的元数据 ..."

MISSING=0
for required in latest.yml latest-win-arm64.yml; do
  if [ ! -f "$OUTPUT_DIR/$required" ]; then
    echo "::error::缺少必需的更新元数据: $required"
    MISSING=1
  fi
done

if [ "$MISSING" -ne 0 ]; then
  exit 1
fi

echo ""
echo "==> 已准备的发布产物:"
ls -lh "$OUTPUT_DIR"
echo ""
echo "==> 完成。"
