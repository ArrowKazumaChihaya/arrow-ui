<script setup lang="ts">
/**
 * ArModal 1.1 — ポップアップ。
 * 頭（題・1行の説明・閉じる）、手順（頭の下）、中身、足（左に補足・戻る、右にキャンセルと主なボタン）。
 * 開くと中の最初の入力にフォーカスし、Tab は中で回る。閉じると開く前の場所にフォーカスを戻す。
 * スマホ（幅640px以下）では画面いっぱいになる（mobileFullscreen）。確かめは variant="confirm" か useArConfirm()。
 */
import { computed, ref, useSlots } from "vue";
import { useArUi, useDesignForm, useId } from "../provider/context";
import { useDialog } from "../internal/dialog";
import ArIcon from "./ArIcon.vue";
import ArButton from "./ArButton.vue";
import type { ArIconName } from "../icons";
import type { ArModalProps } from "./ArModal.contract";

const props = withDefaults(defineProps<ArModalProps>(), {
  description: undefined,
  size: "md",
  width: undefined,
  steps: undefined,
  currentStep: 0,
  stepsClickable: false,
  closable: true,
  closeOnScrim: false,
  teleportTo: "body",
  contained: false,
  mobileFullscreen: true,
  variant: "default",
  icon: undefined,
  iconTone: undefined,
  footerNote: undefined,
  footerNoteAlign: "start",
  okText: undefined,
  okTone: "primary",
  okIcon: undefined,
  okDisabled: false,
  okLoading: false,
  cancelText: "キャンセル",
  backText: undefined,
  labels: () => ({ close: "閉じる", step: "手順" }),
});
const emit = defineEmits<{
  "update:open": [open: boolean];
  close: [];
  ok: [];
  cancel: [];
  back: [];
  "update:currentStep": [step: number];
}>();
const slots = useSlots();

const id = useId("ar-modal");
const ui = useArUi();
/** 出す先。Provider が scope="self" なら、そのデザインの範囲の中に出す。 */
const target = computed(() => (props.teleportTo === "body" && ui?.portal.value ? ui.portal.value : (props.teleportTo ?? "body")));
const panel = ref<HTMLElement | null>(null);

const confirm = computed(() => props.variant === "confirm");
const iconName = computed<ArIconName | undefined>(() => props.icon ?? (confirm.value ? "alert" : undefined));
const tone = computed(() => props.iconTone ?? (confirm.value ? "warn" : "info"));
const panelStyle = computed(() =>
  props.width === undefined ? undefined : { maxWidth: typeof props.width === "number" ? `${props.width}px` : props.width },
);
/** 形（ArDesign.forms.ArModal.buttonText）：antd は 2 文字の漢字・かなのボタンの間に空白を入れる（「登 録」）。plain はそのまま。 */
const buttonText = useDesignForm<"plain" | "antd">("ArModal", "buttonText", "plain");
const label = (t: string) => (buttonText.value === "antd" && /^[\u3040-\u30ff\u3400-\u9fff]{2}$/.test(t) ? `${t[0]} ${t[1]}` : t);
const builtIn = computed(() => !slots.footer && !!props.okText);
const hasStart = computed(() => !!slots["footer-start"] || !!props.backText || (!!props.footerNote && props.footerNoteAlign === "start"));
const hasEnd = computed(() => !!slots.footer || builtIn.value || (!!props.footerNote && props.footerNoteAlign === "end"));

function close() {
  emit("update:open", false);
  emit("close");
}
function cancel() {
  emit("cancel");
  close();
}
function pickStep(i: number) {
  if (props.stepsClickable && i < props.currentStep) emit("update:currentStep", i);
}

const { onKeydown, palette } = useDialog({
  open: () => props.open,
  panel,
  initial: () => panel.value?.querySelector<HTMLElement>('[data-part="body"]') ?? (confirm.value ? panel.value?.querySelector<HTMLElement>('[data-part="footer"]') : null),
  escapable: () => props.closable,
  onEscape: close,
  lockScroll: () => !props.contained,
});
</script>

<template>
  <Teleport :to="target" :disabled="teleportTo === null || contained" defer>
    <div
      v-if="open"
      data-ar="modal"
      data-part="root"
      :data-size="size"
      :data-variant="variant"
      :data-contained="contained || undefined"
      :data-mobile="mobileFullscreen && !confirm && size !== 'full' ? 'fullscreen' : undefined"
      :data-ar-palette="palette"
      @keydown="onKeydown"
    >
      <div data-part="scrim" aria-hidden="true" @click="closeOnScrim && close()" />
      <div
        ref="panel"
        data-part="panel"
        :role="confirm ? 'alertdialog' : 'dialog'"
        aria-modal="true"
        :aria-labelledby="`${id}-title`"
        :aria-describedby="description ? `${id}-desc` : undefined"
        tabindex="-1"
        :style="panelStyle"
      >
        <header data-part="header">
          <span v-if="iconName" data-part="icon" :data-tone="tone" :data-icon="iconName"><ArIcon :name="iconName" /></span>
          <div data-part="heading">
            <h2 :id="`${id}-title`" data-part="title"><slot name="title">{{ title }}</slot></h2>
            <p v-if="description" :id="`${id}-desc`" data-part="description">{{ description }}</p>
          </div>
          <button v-if="closable && !confirm" type="button" data-part="close" :aria-label="labels.close" @click="close">
            <ArIcon name="x" />
          </button>
        </header>
        <div v-if="steps?.length || $slots.toolbar" data-part="nav" :data-toolbar="$slots.toolbar ? '' : undefined">
          <div v-if="$slots.toolbar" data-part="toolbar"><slot name="toolbar" /></div>
          <ol v-if="steps?.length" data-part="steps" :aria-label="labels.step">
            <li
              v-for="(s, i) in steps"
              :key="s"
              data-part="step"
              :data-state="i < currentStep ? 'done' : i === currentStep ? 'current' : undefined"
              :aria-current="i === currentStep ? 'step' : undefined"
            >
              <component
                :is="stepsClickable && i < currentStep ? 'button' : 'span'"
                :type="stepsClickable && i < currentStep ? 'button' : undefined"
                data-part="step-label"
                @click="pickStep(i)"
              >
                <span data-part="step-mark" aria-hidden="true"><ArIcon v-if="i < currentStep" name="check" size="sm" /><template v-else>{{ i + 1 }}</template></span>{{ s }}
              </component>
            </li>
          </ol>
        </div>
        <div v-if="$slots.default" data-part="body"><slot /></div>
        <footer v-if="hasStart || hasEnd" data-part="footer">
          <div v-if="hasStart" data-part="footer-start">
            <ArButton v-if="backText" tone="secondary" icon="cl" @click="emit('back')">{{ backText }}</ArButton>
            <slot name="footer-start" />
            <span v-if="footerNote && footerNoteAlign === 'start'" data-part="note">{{ footerNote }}</span>
          </div>
          <div v-if="hasEnd" data-part="footer-end">
            <span v-if="footerNote && footerNoteAlign === 'end'" data-part="note">{{ footerNote }}</span>
            <slot name="footer">
              <template v-if="builtIn">
                <ArButton v-if="cancelText" tone="secondary" @click="cancel">{{ label(cancelText) }}</ArButton>
                <ArButton
                  :tone="okTone"
                  :icon="okIcon"
                  :disabled="okDisabled"
                  :loading="okLoading"
                  data-ok=""
                  @click="emit('ok')"
                >{{ label(okText ?? "") }}</ArButton>
              </template>
            </slot>
          </div>
        </footer>
      </div>
    </div>
  </Teleport>
</template>
