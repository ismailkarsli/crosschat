const parseMessage = (message) => {
  const result = message.match(
    /^(?<author>.+?)\((?<platform>.+?)\): (?<message>.*)$/i
  );
  return result?.groups;
};

const observeTwitch = () => {
  const targetNode = document.querySelector(
    ".chat-scrollable-area__message-container"
  );

  const config = { childList: true, subtree: true };

  const callback = function (mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        const newNodes = mutation.addedNodes;
        for (const node of newNodes) {
          if (node?.classList?.contains("chat-line__message")) {
            const authorEl = node.querySelector(".chat-author__display-name");
            const messageEl =
              node.querySelector(
                ".chat-line__message-container .text-fragment"
              ) ||
              node.querySelector(
                ".seventv-message-context .seventv-text-fragment"
              );

            if (!authorEl || !messageEl) continue;

            if (authorEl.innerText.toLowerCase() === "crosschatbot") {
              const parsedMessage = parseMessage(messageEl.innerText);
              if (!parsedMessage) continue;
              const { author, message, platform } = parsedMessage;
              console.log({ author, message, platform });
              authorEl.innerText = author;
              messageEl.innerText = message;
            }
          }
        }
      }
    }
  };

  const observer = new MutationObserver(callback);

  observer.observe(targetNode, config);
};

const observeYoutube = () => {};

window.addEventListener("load", () => {
  const hostname = window.location.hostname;
  if (hostname.includes("twitch")) {
    observeTwitch();
  } else if (hostname.includes("youtube")) {
    observeYoutube();
  }
});
