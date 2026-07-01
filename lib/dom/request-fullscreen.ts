type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
};

export function getFullscreenElement(): Element | null {
  const doc = document as FullscreenDocument;

  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

export async function requestElementFullscreen(
  element: HTMLElement | null,
): Promise<boolean> {
  if (!element) {
    return false;
  }

  try {
    const fullscreenElement = element as FullscreenElement;

    if (fullscreenElement.requestFullscreen) {
      await fullscreenElement.requestFullscreen();
      return true;
    }

    if (fullscreenElement.webkitRequestFullscreen) {
      await fullscreenElement.webkitRequestFullscreen();
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

export async function exitElementFullscreen(): Promise<void> {
  if (!getFullscreenElement()) {
    return;
  }

  const doc = document as FullscreenDocument;

  try {
    if (doc.exitFullscreen) {
      await doc.exitFullscreen();
      return;
    }

    if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen();
    }
  } catch {
    // Ignore — overlay can still close via React state.
  }
}

export function subscribeToFullscreenChange(
  listener: () => void,
): () => void {
  document.addEventListener("fullscreenchange", listener);
  document.addEventListener("webkitfullscreenchange", listener);

  return () => {
    document.removeEventListener("fullscreenchange", listener);
    document.removeEventListener("webkitfullscreenchange", listener);
  };
}
