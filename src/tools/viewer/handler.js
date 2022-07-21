import utils from '@/utils';
import {PureComponent} from 'react';
import pannellum from '../libraries/pannellum';

class Handler extends PureComponent {
  panoramas({children}) {
    const rooms = Array.isArray(children) ? [...children] : [children];
    const mappingRoom = rooms.map((c) => {
      const room = {...c.props};
      room.panorama = room.panoramaImage;
      room.hotSpots = room.markers.map((marker) => {
        switch (marker.object) {
          case 'marker':
            let eventHandling = {};
            let tooltip = marker.tooltipText;
            if (marker.tooltip_type == 'room_name') {
              tooltip = marker.nameRoomTarget;
            }
            if (marker.draggable) {
              eventHandling = {
                dragHandlerFunc: this.draggable,
                dragHandlerArgs: this,
              };
            } else {
              eventHandling = {
                clickHandlerFunc: this.goto,
                clickHandlerArgs: [
                  this,
                  marker.idRoomTarget,
                  parseInt(marker.pitch),
                  parseInt(marker.yaw),
                  marker.transitionZoom,
                  marker.timeAnimated,
                  marker.lookAt,
                ],
              };
            }
            return {
              id: marker.id,
              text: tooltip,
              cssClass: 'custom-hotspot',
              createTooltipFunc: this.hotspot,
              createTooltipArgs: marker,
              pitch: marker.pitch,
              yaw: marker.yaw,
              icon: marker.icon,
              type: marker.type,
              draggable: marker.draggable,
              animation: marker.animation,
              transform3d: marker.transform3d,
              rotateX: marker.rotateX,
              rotateZ: marker.rotateZ,
              scale: marker.scale,
              sizeScale: marker.sizeScale,
              object: marker.object,
              idRoomTarget: marker.idRoomTarget,
              nameRoomTarget: marker.nameRoomTarget,
              ...eventHandling,
            };
        }
      });
      delete room.markers;
      delete room.panoramaImage;
      if (room.type == 'image') {
        room.type = 'equirectangular';
      }
      return room;
    });

    return mappingRoom.reduce((accumulated, current) => {
      return {
        ...accumulated,
        [current.id]: current,
      };
    }, {});
  }

  initializeRoom() {
    try {
      this.panoViewer.destroy();
      this.panoViewer = null;
    } catch (error) {}
    this.panoViewer = pannellum.viewer('panorama_view', {
      autoLoad: true,
      firstScene: 'scene1',
      showZoomCtrl: false,
      showFullscreenCtrl: false,
      scenes: this.state.panoramas,
    });
    this.panoViewer.on('load', () => {
      setTimeout(() => {
        this.loading(false);
      }, 50);
    });
  }

  loading(status) {
    document.getElementById('loading_pano').style.opacity = Number(status);
    document.getElementById('loading_pano').style.display = status
      ? 'block'
      : 'none';
  }

  goto(_, [_this, idRoom, pitch, yaw, zoom, animated, lookAt]) {
    let yawM = yaw;
    let pitchM = pitch;
    _this.loading(true);
    lookAt = lookAt === undefined ? 0 : Number(lookAt);
    if (lookAt == 0) {
      pitchM = parseFloat(_this.panoViewer.getPitch());
      yawM = parseFloat(_this.panoViewer.getYaw());
    }
    const room = _this.state.panoramas[idRoom];
    const hfovM = parseInt(_this.panoViewer.getHfov());
    const transitionZoom = hfovM - zoom;
    _this.panoViewer.lookAt(pitchM, yawM, transitionZoom, animated, () => {
      _this.panoViewer.loadScene(idRoom, room.pitch, room.yaw, room.hfov);
    });
  }

  draggable(_, _this) {
    _this.panoViewer.setPitch(this.pitch);
    _this.panoViewer.setYaw(this.yaw);
  }

  hotspot(hotSpotDiv, args) {
    hotSpotDiv.classList.add('custom-tooltip');
    hotSpotDiv.classList.add('noselect');
    hotSpotDiv.classList.add('marker_' + args.id);
    hotSpotDiv.addEventListener('mouseover', function (e) {
      if (!utils.isMobileOrIOS) {
        document.getElementById('tooltip_marker_' + args.id).style.opacity = 1;
      }
    });
    hotSpotDiv.addEventListener('mouseenter', function (e) {
      if (!utils.isMobileOrIOS) {
        document.getElementById('tooltip_marker_' + args.id).style.opacity = 1;
      }
    });
    hotSpotDiv.addEventListener('mouseleave', function (e) {
      if (!utils.isMobileOrIOS) {
        document.getElementById('tooltip_marker_' + args.id).style.opacity = 0;
      }
    });

    switch (args.tooltipType) {
      case 'text':
        if (args.tooltipText && args.tooltipText !== '') {
          const tooltip = document.createElement('div');
          tooltip.setAttribute('id', 'tooltip_marker_' + args.id);
          tooltip.classList.add('tooltip_marker_' + args.id);
          tooltip.classList.add('tooltip_text');
          tooltip.innerHTML = args.tooltipText.toUpperCase();
          hotSpotDiv.parentNode.appendChild(tooltip);
        }
        break;
      case 'room_name':
        const tooltip = document.createElement('div');
        tooltip.setAttribute('id', 'tooltip_marker_' + args.id);
        tooltip.classList.add('tooltip_marker_' + args.id);
        tooltip.classList.add('tooltip_text');
        tooltip.innerHTML = args.nameRoomTarget.toUpperCase();
        hotSpotDiv.parentNode.appendChild(tooltip);
        break;
    }

    const divWrapper = document.createElement('div');
    divWrapper.classList.add('div_marker_wrapper');
    divWrapper.style.background = args.background;
    divWrapper.style.color = args.color;
    hotSpotDiv.appendChild(divWrapper);
  }

  componentWillUnmount() {
    this.panoViewer.off('load');
  }
}

export default Handler;
