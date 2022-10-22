toolbarLeft={
    <>
      {entered &&
        isMobileVR && (
          <ToolbarButton
            className={styleUtils.hideLg}
            icon={<VRIcon />}
            preset="accept"
            label={<FormattedMessage id="toolbar.enter-vr-button" defaultMessage="Enter VR" />}
            onClick={() => exit2DInterstitialAndEnterVR(true)}
          />
        )}
    </>
  }
  toolbarCenter={
    <>
      {watching && (
        <>
          <ToolbarButton
            icon={<EnterIcon />}
            label={<FormattedMessage id="toolbar.join-room-button" defaultMessage="Join Room" />}
            preset="accept"
            onClick={() => this.setState({ watching: false })}
          />
          {enableSpectateVRButton && (
            <ToolbarButton
              icon={<VRIcon />}
              preset="accent5"
              label={
                <FormattedMessage id="toolbar.spectate-in-vr-button" defaultMessage="Spectate in VR" />
              }
              onClick={() => this.props.scene.enterVR()}
            />
          )}
        </>
      )}
      {false && entered && (
        <>
          <AudioPopoverContainer scene={this.props.scene} />
          <SharePopoverContainer scene={this.props.scene} hubChannel={this.props.hubChannel} />
          <PlacePopoverContainer
            scene={this.props.scene}
            hubChannel={this.props.hubChannel}
            mediaSearchStore={this.props.mediaSearchStore}
            showNonHistoriedDialog={this.showNonHistoriedDialog}
          />
          {this.props.hubChannel.can("spawn_emoji") && (
            <ReactionPopoverContainer
              scene={this.props.scene}
              initialPresence={getPresenceProfileForSession(this.props.presences, this.props.sessionId)}
            />
          )}
        </>
      )}
      {/* <ChatToolbarButtonContainer onClick={() => this.toggleSidebar("chat")} /> */}
      {false && entered && isMobileVR && (
        <ToolbarButton
          className={styleUtils.hideLg}
          icon={<VRIcon />}
          preset="accept"
          label={<FormattedMessage id="toolbar.enter-vr-button" defaultMessage="Enter VR" />}
          onClick={() => exit2DInterstitialAndEnterVR(true)}
        />
      )}
    </>
  }
  toolbarRight={
    <>
      {false && entered && isMobileVR && (
        <ToolbarButton
          icon={<VRIcon />}
          preset="accept"
          label={<FormattedMessage id="toolbar.enter-vr-button" defaultMessage="Enter VR" />}
          onClick={() => exit2DInterstitialAndEnterVR(true)}
        />
      )}
      {false && entered && (
        <ToolbarButton
          icon={<LeaveIcon />}
          label={<FormattedMessage id="toolbar.leave-room-button" defaultMessage="Leave" />}
          preset="cancel"
          onClick={() => {
            this.showNonHistoriedDialog(LeaveRoomModal, {
              destinationUrl: "/",
              reason: LeaveReason.leaveRoom
            });
          }}
        />
      )}
      {/* <MoreMenuPopoverButton menu={moreMenu} /> */}
    </>
    }