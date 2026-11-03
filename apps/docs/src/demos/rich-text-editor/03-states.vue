<!-- 状態 | 空のときの薄い字（placeholder）・上限（maxLength を越えると数が赤く、赤い枠）・誤り（invalid）・読むだけ（readonly：ツールバーなし）・押せない（disabled）。危ないタグ（script・iframe・onclick など）は入れても消える。 -->
<script setup lang="ts">
import { ArRichTextEditor, ArStack } from "@arrow/ui";
import { ref } from "vue";
const a = ref("");
const b = ref("<p>上限は30文字です。ここに長い文章を入れると、文字数が赤くなります。</p>");
const c = ref('<p onclick="alert(1)">本文に危ないタグを入れても <script>alert(1)<\/script><iframe src="https://example.com"></iframe>消えます。</p>');
const d = ref("<p>読むだけの本文です。<b>太字</b>や<u>下線</u>はそのまま出ます。</p>");
</script>

<template>
<ArStack :gap="5" style="max-width: 720px">
  <ArRichTextEditor v-model="a" label="空" placeholder="ここに入力します" :toolbar="['bold', 'italic', 'underline', '|', 'undo', 'redo']" min-height="96px" />
  <ArRichTextEditor v-model="b" label="上限あり" :max-length="30" :toolbar="['bold', 'italic', 'underline', 'color', '|', 'align', 'list']" />
  <ArRichTextEditor v-model="c" label="誤り" invalid :toolbar="['bold', 'italic', 'underline']" />
  <div style="font-size: 12px; color: #66727F; word-break: break-all">v-model の値：{{ c }}</div>
  <ArRichTextEditor v-model="d" label="読むだけ" readonly :counter="false" />
  <ArRichTextEditor v-model="d" label="押せない" disabled :toolbar="['bold', 'italic', 'underline', '|', 'undo', 'redo']" />
</ArStack>
</template>
