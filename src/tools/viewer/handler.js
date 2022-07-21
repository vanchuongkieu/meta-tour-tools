import {PureComponent} from 'react';
import pannellum from '../libraries/pannellum';

class Handler extends PureComponent {
  panoramas({children}) {
    const rooms = Array.isArray(children) ? [...children] : [children];
    return rooms.map((c) => {
      const room = {...c.props};
      room.panorama = room.panoramaImage;
      if (room.panoramaBlob) {
        room.panorama = room.panoramaBlob;
      }
      room.hotSpots = room.markers.map((marker) => {
        switch (marker.object) {
          case 'marker':
            let tooltip = marker.tooltip_text;
            if (marker.tooltip_type == 'room_name') {
              tooltip = marker.nameRoomTarget;
            }
            return {
              id: marker.id,
              text: tooltip,
              pitch: marker.pitch,
              yaw: marker.yaw,
              icon: marker.icon,
              type: marker.type,
              animation: marker.animation,
              transform3d: marker.transform3d,
              rotateX: marker.rotateX,
              rotateZ: marker.rotateZ,
              scale: marker.scale,
              sizeScale: marker.sizeScale,
              object: marker.object,
              idRoomTarget: marker.idRoomTarget,
              nameRoomTarget: marker.nameRoomTarget,
              clickHandlerFunc: this.goto,
              clickHandlerArgs: [
                this,
                marker.idRoomTarget,
                parseInt(marker.pitch),
                parseInt(marker.yaw),
                marker.transitionZoom,
                marker.lookAt,
              ],
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
  }

  startWithFirstRoom() {
    return this.initializeRoom(this.state.panoramas[0]);
  }

  initializeRoom(room) {
    try {
      this.panoViewer.destroy();
    } catch (error) {}
    this.panoViewer = null;
    this.panoViewer = pannellum.viewer('panorama_view', {
      ...room,
      autoLoad: true,
      showZoomCtrl: false,
      showFullscreenCtrl: false,
    });
    this.panoViewer.on('load', () => {
      setTimeout(() => {
        document.getElementById('loading_pano').style.opacity = 0;
        document.getElementById('loading_pano').style.display = 'none';
      }, 100);
    });
  }

  loadImage(url, id, index) {
    return new Promise(function (resolve) {
      try {
        fetch(url)
          .then((res) => res.blob())
          .then((res) => resolve(res, id, index));
      } catch (err) {
        resolve('', id, index);
      }
    });
  }

  findRoom(idRoom) {
    return this.state.panoramas.find((panorama) => panorama.id === idRoom);
  }

  fadeBackground(room) {
    const dataURL = this.panoViewer
      .getRenderer()
      .render(
        (this.panoViewer.getPitch() / 180) * Math.PI,
        (this.panoViewer.getYaw() / 180) * Math.PI,
        (this.panoViewer.getHfov() / 180) * Math.PI,
        {returnImage: 'blob'}
      );
    room.preview = dataURL;
    document.getElementById('loading_pano').style =
      'opacity: 1; display: block';
    setTimeout(() => {
      this.initializeRoom(room);
    }, 50);
  }

  goto(_, [_this, idRoom, pitch, yaw, zoom, lookAt]) {
    lookAt = lookAt === undefined ? 0 : Number(lookAt);
    const room = _this.findRoom(idRoom);
    let pitchM = pitch;
    let yawM = yaw;
    if (lookAt == 0) {
      pitchM = parseFloat(_this.panoViewer.getPitch());
      yawM = parseFloat(_this.panoViewer.getYaw());
    }
    const hfovM = parseInt(_this.panoViewer.getHfov());
    const transitionZoom = hfovM - zoom;
    _this.lookAt(pitchM, yawM, transitionZoom, 300, () => {
      _this.fadeBackground(room);
    });
  }

  lookAt(...args) {
    this.panoViewer.lookAt(...args);
  }
}

export default Handler;
