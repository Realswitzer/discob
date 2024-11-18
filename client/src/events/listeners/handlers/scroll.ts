import { fetchMessages, prependMessages } from "../../../utils"
import { $messages } from "../../../globals"

//let loadingMessages = false
let loadedMessages = 50
let timeout = null

export function scrollHandler(event: JQuery.ScrollEvent) {
	if (!timeout) {
		timeout = setTimeout(() => {
			clearTimeout(timeout)
			timeout = null
			if (this.scrollTop < 600) {
			  	  const currentHeight = $messages[0].scrollHeight
				    const currentScroll = $messages.scrollTop()
          prependMessages("public", 50, loadedMessages).then(messages => {
				    const newHeight = $messages[0].scrollHeight
          
				    $messages.scrollTop(newHeight - currentHeight + currentScroll)
				    loadedMessages += messages.length
        })
      }
			}, 250)
		}
	}

