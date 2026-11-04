<!-- 今の Thumbnail の呼び方との対応 | isEditting・updateIsEditting → v-model:open、width・height → crop-width・crop-height（aspect="crop" で画面の箱も同じ比。社員カードの 300×189）、silhouette="picture" → placeholder="picture"（不具合の報告のキャプチャー）、dialogOnly・freeCrop・allowedExtension → dialog-only・free-crop・accept（添付の「写真を追加」：四隅のつまみで範囲を変え、「登録」で PNG の File を file で受け取る）、invalidImage → invalid-image。 -->
<script setup lang="ts">
import { ArButton, ArCluster, ArThumbnail } from "@arrow/ui";
import { ref } from "vue";
const card = ref<string | null>(null);
const editingCard = ref(false);
const shot = ref<string | null>(null);
const cropping = ref(false);
const files = ref<string[]>([]);
const message = ref("");
</script>

<template>
  <ArCluster :gap="8" align="end">
    <div>
      <ArThumbnail v-model="card" v-model:open="editingCard" :size="240" aspect="crop" :crop-width="300" :crop-height="189" :quality="5" alt="社員カードの画像" />
      <p style="margin: 6px 0 0; font-size: 12px">社員カード（開いている：{{ editingCard ? "はい" : "いいえ" }}）</p>
    </div>
    <div>
      <ArThumbnail v-model="shot" :size="240" aspect="crop" :crop-width="600" :crop-height="378" placeholder="picture" alt="画面のキャプチャー" />
      <p style="margin: 6px 0 0; font-size: 12px">不具合の報告のキャプチャー</p>
    </div>
    <div>
      <ArButton tone="primary" icon="camera" @click="cropping = true">写真を追加</ArButton>
      <ArThumbnail
        v-model:open="cropping"
        :model-value="null"
        dialog-only
        free-crop
        :crop-width="400"
        :crop-height="400"
        :accept="['jpg', 'jpeg', 'png']"
        :max-file-bytes="20 * 1024 * 1024"
        :max-image-pixels="40000000"
        @file="(f) => files.push(`${f.name}（${f.size} バイト）`)"
        @invalid-image="(r) => (message = `受け付けない画像です（${r}）`)"
      />
      <p style="margin: 6px 0 0; font-size: 12px">添付：{{ files.join("、") || "なし" }} {{ message }}</p>
    </div>
  </ArCluster>
</template>
