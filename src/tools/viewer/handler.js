import utils from '@/utils';
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
        delete room.panoramaBlob;
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
      orientationOnByDefault: utils.isMobileOrIOS,
    });
    this.panoViewer.on('load', () => {
      this.preloadNextImage();
    });
  }

  async preloadNextImage() {
    const {panoramas} = this.state;
    const mapBlob = [];
    for (let i = 0; i < panoramas.length; i++) {
      const img = panoramas[i].panorama;
      const id = panoramas[i].id;
      const mapping = await this.loadImage(img, id, i).then((response) => {
        const imageBlob = window.URL.createObjectURL(response);
        return {...panoramas[i], panoramaBlob: imageBlob};
      });
      mapBlob.push(mapping);
    }
    this.setState({panoramas: mapBlob});
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

  goto(_, [_this, idRoom, pitch, yaw, lookAt]) {
    lookAt = lookAt === undefined ? 0 : Number(lookAt);
    const room = _this.findRoom(idRoom);
    switch (lookAt) {
      case 0:
        _this.initializeRoom(room);
        break;
      case 1:
        _this.lookAt(pitch, yaw, 120, 400, () => {
          _this.initializeRoom(room);
        });
        break;
    }
  }

  lookAt(...args) {
    this.panoViewer.lookAt(...args);
  }
}

export default Handler;
