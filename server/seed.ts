import 'dotenv/config';
import prisma from './db.js';

function hashPassword(pw: string): string {
  let hash = 0;
  for (let i = 0; i < pw.length; i++) {
    const c = pw.charCodeAt(i);
    hash = ((hash << 5) - hash) + c;
    hash |= 0;
  }
  return 'hashed_' + Math.abs(hash).toString(36) + '_' + pw.length;
}

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminEmail = 'admin@subflow.io';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  let adminId = 'admin-001';
  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        id: 'admin-001',
        email: adminEmail,
        password_hash: hashPassword('admin123'),
        first_name: 'Admin',
        last_name: 'User',
        phone: '+1234567890',
        role: 'admin',
        is_verified: true,
      },
    });
    adminId = admin.id;
    console.log('Admin user created successfully.');
  } else {
    adminId = existingAdmin.id;
    console.log('Admin user already exists.');
  }

  // Check if services exist, if not, create some default ones to make it look premium
  const servicesCount = await prisma.service.count();
  if (servicesCount === 0) {
    console.log('Creating default services and plans...');

    // Service 1: Figma
    const figma = await prisma.service.create({
      data: {
        name: 'Figma',
        description: 'Collaborative interface design tool for teams.',
        category: 'Design',
        icon: 'Framer',
        status: 'active',
        plans: {
          create: [
            {
              name: 'Figma Professional',
              description: 'For teams with unlimited files and sharing permissions.',
              price: 15.00,
              billing_cycle: 'monthly',
              features: ['Unlimited Figma files', 'Shared team library', 'Audio spaces', 'Custom file permissions'],
              trial_days: 7,
              status: 'active',
              max_users: 10,
            },
            {
              name: 'Figma Organization',
              description: 'For companies requiring design system management and org-wide controls.',
              price: 45.00,
              billing_cycle: 'monthly',
              features: ['Org-wide libraries', 'Centralized file management', 'Single sign-on (SSO)', 'Advanced analytics'],
              trial_days: 14,
              status: 'active',
              max_users: 100,
            }
          ]
        }
      }
    });

    // Service 2: GitHub
    const github = await prisma.service.create({
      data: {
        name: 'GitHub',
        description: 'Developer platform for version control, hosting, and collaboration.',
        category: 'Development',
        icon: 'Github',
        status: 'active',
        plans: {
          create: [
            {
              name: 'GitHub Team',
              description: 'Advanced collaboration and support for organization owners.',
              price: 4.00,
              billing_cycle: 'monthly',
              features: ['3,000 Actions minutes/month', '2GB Packages storage', 'Branch protection rules', 'Codespaces access'],
              trial_days: 0,
              status: 'active',
              max_users: 50,
            },
            {
              name: 'GitHub Enterprise',
              description: 'Security, compliance, and flexible deployment controls.',
              price: 21.00,
              billing_cycle: 'monthly',
              features: ['50,000 Actions minutes/month', '50GB Packages storage', 'SAMl single sign-on', 'Advanced security audits'],
              trial_days: 30,
              status: 'active',
              max_users: 1000,
            }
          ]
        }
      }
    });

    // Service 3: Slack
    const slack = await prisma.service.create({
      data: {
        name: 'Slack',
        description: 'Communication hub for professional workspaces.',
        category: 'Communication',
        icon: 'MessageSquare',
        status: 'active',
        plans: {
          create: [
            {
              name: 'Slack Pro',
              description: 'For small teams needing unlimited search history and integrations.',
              price: 8.75,
              billing_cycle: 'monthly',
              features: ['Unlimited message history', 'Unlimited app integrations', 'Group huddles with screen share', 'Secure guest channels'],
              trial_days: 0,
              status: 'active',
              max_users: 25,
            }
          ]
        }
      }
    });

    console.log('Default services and plans created.');
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
