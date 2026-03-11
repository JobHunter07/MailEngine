import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'

const ConfirmDialog: React.FC<{ open: boolean; title?: string; onClose: () => void; onConfirm: () => void }> = ({ open, title = 'Confirm', onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent />
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} variant="contained">OK</Button>
    </DialogActions>
  </Dialog>
)

export default ConfirmDialog
