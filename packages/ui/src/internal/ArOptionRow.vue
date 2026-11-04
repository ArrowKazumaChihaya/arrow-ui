<script setup lang="ts">
/**
 * 候補の1行（ライブラリの中だけで使う）。ArSelect・ArAutoComplete・ArMentions・ArCascader が使う。
 * 頭文字の丸・アイコン・名前（合っている文字はテーマ色の太字）・右の小さな文字・チェック・次の段への印。
 * 見た目は data-part="option" と子の部位で、各デザインの _picker.css が当てる。
 */
import { computed } from "vue";
import ArIcon from "../components/ArIcon.vue";
import type { ArIconName } from "../icons";
import type { ArTextPiece } from "./options";

const props = withDefaults(
  defineProps<{
    id?: string;
    pieces: readonly ArTextPiece[];
    selected?: boolean;
    active?: boolean;
    disabled?: boolean;
    /** 選んでいる道筋（カスケーダーの途中の段）。 */
    path?: boolean;
    avatar?: string;
    avatarColor?: string;
    avatarInk?: string;
    icon?: ArIconName;
    /** 頭の色の小さな丸（パターンの色など）。 */
    dot?: string;
    description?: string;
    /** 右の小さな文字の色。 */
    descriptionTone?: "default" | "ok" | "warn" | "danger";
    /** 選んでいるときチェックを出す。 */
    check?: boolean;
    /** 次の段がある（右向きの印）。 */
    more?: boolean;
    role?: string;
  }>(),
  {
    id: undefined,
    selected: false,
    active: false,
    disabled: false,
    path: false,
    avatar: undefined,
    avatarColor: undefined,
    avatarInk: undefined,
    icon: undefined,
    dot: undefined,
    description: undefined,
    descriptionTone: "default",
    check: true,
    more: false,
    role: "option",
  },
);
const state = computed(
  () =>
    [props.selected && "selected", props.path && "path", props.active && "active", props.disabled && "disabled"].filter(Boolean).join(" ") ||
    undefined,
);
const avatarStyle = computed(() =>
  props.avatarColor || props.avatarInk ? { background: props.avatarColor, color: props.avatarInk } : undefined,
);
</script>

<template>
  <div
    :id="id"
    data-part="option"
    :role="role"
    :aria-selected="role === 'option' ? selected : undefined"
    :aria-disabled="disabled || undefined"
    :data-state="state"
    :data-has-avatar="avatar !== undefined || undefined"
  >
    <span v-if="avatar !== undefined" data-part="avatar" aria-hidden="true" :style="avatarStyle">{{ avatar }}</span>
    <ArIcon v-else-if="icon" :name="icon" size="sm" data-part="option-icon" />
    <span v-else-if="dot" data-part="option-dot" aria-hidden="true" :style="{ background: dot }" />
    <span data-part="option-label"
      ><template v-for="(p, i) in pieces" :key="i"
        ><mark v-if="p.match" data-part="match">{{ p.text }}</mark
        ><template v-else>{{ p.text }}</template></template
      ><slot name="after-label"
    /></span>
    <small v-if="description" data-part="option-desc" :data-tone="descriptionTone === 'default' ? undefined : descriptionTone">{{ description }}</small>
    <ArIcon line v-if="check && selected && !more" name="check" size="sm" data-part="option-check" />
    <ArIcon line v-if="more" name="cr" size="sm" data-part="option-more" />
  </div>
</template>
