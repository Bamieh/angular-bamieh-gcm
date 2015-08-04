function bamiehGcmState() {
  var checkedGmc = 'init';
  var disabledGmc = true;
  this.setChecked = setChecked;
  this.setDisabled = setDisabled;
  this.$get = function() {
    return {
      getChecked: getChecked,
      getDisabled: getDisabled,
      setChecked: setChecked,
      setDisabled: setDisabled
    }
  }
  function setChecked(isChecked) {
    console.log('bamiehGcmStateProvider Set Checked State = ' + isChecked);
    checkedGmc = isChecked;
  }
  function setDisabled(isDisabled) {
    console.log('bamiehGcmStateProvider Set Disabled State = ' + isDisabled);
    disabledGmc = isDisabled;
  }
  function getDisabled() {
    return disabledGmc;
  }
  function getChecked() {
    return checkedGmc;
  }
}
