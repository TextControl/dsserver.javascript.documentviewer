var DocumentServices = (function (tx) {
	
	var m_clientID,
		m_clientSecret,
		m_serviceURL,
		m_containerID,
		m_accessToken,
		m_userNames = [ "unknown user" ];
		m_isSelectionActivated = true;
		m_showThumbnailPane = true;

	tx.DocumentViewer = {

		setUserNames: function (userNames) {
			m_userNames = userNames;
		},

		setIsSelectionActivated: function (activated) {
			m_isSelectionActivated = activated;
		},

		setShowThumbnailPane: function (show) {
			m_showThumbnailPane = show;
		},

		init: function (clientID, clientSecret, serviceURL, containerID) { 
			m_clientID = clientID;
			m_clientSecret = clientSecret;
			m_serviceURL = serviceURL;
			m_containerID = containerID;

			var script = document.createElement('script');

			script.onload = function () {
					
				TXDocumentViewer.init( {
					containerID: m_containerID,
					viewerSettings: {
						toolbarDocked: true,
						dock: "Fill",
						userNames: m_userNames,
						isSelectionActivated: m_isSelectionActivated,
						showThumbnailPane: m_showThumbnailPane,
						basePath: m_serviceURL + "/documentviewer",
						oauthSettings: {
							accessToken: m_accessToken
						}
					}
				});
				
			};

			getAccessToken(function(token) {
				m_accessToken = token;
				script.src = m_serviceURL + "/documentviewer/textcontrol/GetResource?Resource=minimized.tx-viewer.min.js&access_token=" + m_accessToken;
				document.head.appendChild(script);
			});
		},

	}

	function getAccessToken(callback) {

		$.ajax({
			type: "POST",
			headers: {
				"Authorization": "Basic " + btoa(m_clientID + ":" + m_clientSecret)
			},
			url: m_serviceURL + "/OAuth/Token",
			data: {
				"grant_type": "client_credentials"
			},
			success: successFunc
		});

		function successFunc(data, status) {
			if (typeof callback == "function") { 		
				callback(data.access_token);
			}
		}
	}

	return tx;

} ( DocumentServices || {} ));