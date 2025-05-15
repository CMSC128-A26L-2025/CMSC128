import express from 'express';
import { alumniController } from '../controllers/modelControllers/alumniController.js';
import { createRSVP, editRSVP, viewRSVP } from '../controllers/RSVPController/rsvpController.js';
import { validateToken } from '../middleware/validate-token.js';
import { authorizeRoles } from '../middleware/authorize-roles.js';
import { alumniSearch } from '../controllers/modelControllers/alumniController.js';

const router = express.Router();

router.get('/find-alumni/:id', validateToken, authorizeRoles(["Admin", "Alumni"]), alumniController.findAlumniById);

router.put('/edit-profile/:id', validateToken, authorizeRoles(["Alumni", "Admin"]), alumniController.editProfile);

// delete by email
router.delete('/email/:email', alumniController.deleteByEmail);

// View RSVPs
router.get('alumni/view-all-rsvp', validateToken, authorizeRoles(['Alumni']), viewRSVP);

// alumni-search
router.get('/search', validateToken, authorizeRoles(['Alumni'], ['Admin']), alumniSearch);

export default router;
