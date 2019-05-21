export function AutoUnsubscribe( constructor ) {

  constructor.prototype.ngOnDestroy = function () {
    for ( const prop of Object.keys(this) ) {
      const property = this[ prop ];
      if ( property && property[0] && ((typeof property[0].unsubscribe === 'function'))) {
        property.forEach(p => p.unsubscribe());
      }
      if ( property && ((typeof property.unsubscribe === 'function'))) {
        property.unsubscribe();
      }
    }
  };
}
