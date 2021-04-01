# Dock Spacer

> Add custom spacers to your Dock

## Development

The main AppleScript is `defaults write com.apple.dock persistent-apps -array-add '{"tile-type"="small-spacer-tile";}';killall Dock`,
check [API](https://doc.here.app/#/jsAPI/here?id=hereexecobj-callback).

## License

This is an open source plugin published under the MIT License